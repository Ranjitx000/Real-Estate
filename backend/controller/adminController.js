import User from "../models/User.js";
import Property from "../models/schema.js";
import Inquiry from "../models/Inquiry.js";
import Visit from "../models/Visit.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";

async function generateUniqueSlug(title) {
  const base = slugify(title || "property", { lower: true, strict: true });
  let slug = base;
  let i = 0;
  while (await Property.exists({ slug })) {
    i += 1;
    slug = `${base}-${Date.now().toString(36).slice(-4)}${i}`;
    if (i > 5) break;
  }
  return slug;
}


// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all properties (including pending/rejected)
// @route   GET /api/v1/admin/properties
// @access  Private/Admin
export const getAllProperties = async (req, res) => {
  try {
    const { approvalStatus } = req.query;
    const filter = {};
    if (approvalStatus) filter.approvalStatus = approvalStatus;

    const properties = await Property.find(filter)
      .populate("agent", "name email phone")
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject a property
// @route   PATCH /api/v1/admin/properties/:id/status
// @access  Private/Admin
export const updatePropertyStatus = async (req, res) => {
  try {
    const { approvalStatus } = req.body;
    if (!["pending", "approved", "rejected"].includes(approvalStatus)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { approvalStatus },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a property (fake listing)
// @route   DELETE /api/v1/admin/properties/:id
// @access  Private/Admin
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.json({ success: true, message: "Property removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Analytics Dashboard Data
// @route   GET /api/v1/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAgents = await User.countDocuments({ role: "agent" });
    const totalOwners = await User.countDocuments({ role: "owner" });
    const totalBuyers = await User.countDocuments({ role: "user" });

    const totalProperties = await Property.countDocuments();
    const approvedProperties = await Property.countDocuments({ approvalStatus: "approved" });
    const pendingProperties = await Property.countDocuments({ approvalStatus: "pending" });
    const rejectedProperties = await Property.countDocuments({ approvalStatus: "rejected" });

    // Aggregate total views & favorites across all listings
    const viewsAgg = await Property.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$viewsCount" },
          totalFavorites: { $sum: "$favoritesCount" },
        },
      },
    ]);
    const totalViews = viewsAgg[0]?.totalViews || 0;
    const totalFavorites = viewsAgg[0]?.totalFavorites || 0;

    // Inquiries stats
    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: "New" });

    // Visits stats
    const totalVisits = await Visit.countDocuments();
    const pendingVisits = await Visit.countDocuments({ status: "Pending" });

    // Top 5 viewed properties
    const topViewedProperties = await Property.find({})
      .sort({ viewsCount: -1 })
      .limit(5)
      .select("title viewsCount favoritesCount price currency location images status approvalStatus");

    const propertiesByStatus = await Property.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, agents: totalAgents, owners: totalOwners, buyers: totalBuyers },
        properties: {
          total: totalProperties,
          approved: approvedProperties,
          pending: pendingProperties,
          rejected: rejectedProperties,
          byStatus: propertiesByStatus,
        },
        engagement: {
          totalViews,
          totalFavorites,
          totalInquiries,
          newInquiries,
          totalVisits,
          pendingVisits,
        },
        topViewedProperties,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update User (role, isBlocked)
// @route   PATCH /api/v1/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { role, isBlocked } = req.body;
    const updateData = {};
    if (role) updateData.role = role;
    if (isBlocked !== undefined) updateData.isBlocked = isBlocked;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Property Details (isFeatured, status, etc)
// @route   PATCH /api/v1/admin/properties/:id
// @access  Private/Admin
export const updatePropertyGeneral = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries
// @route   GET /api/v1/admin/inquiries
// @access  Private/Admin
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("customer", "name email phone")
      .populate("property", "title price location")
      .populate("assignedAgent", "name email phone")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry (assign agent, change status)
// @route   PATCH /api/v1/admin/inquiries/:id
// @access  Private/Admin
export const updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("customer", "name email phone")
      .populate("property", "title price location")
      .populate("assignedAgent", "name email phone");
    
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });

    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all visits
// @route   GET /api/v1/admin/visits
// @access  Private/Admin
export const getAllVisits = async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate("customer", "name email phone")
      .populate("property", "title location price")
      .populate("agent", "name email phone")
      .sort({ visitDate: -1, createdAt: -1 });
    res.json({ success: true, count: visits.length, data: visits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update visit (status, reschedule)
// @route   PATCH /api/v1/admin/visits/:id
// @access  Private/Admin
export const updateVisit = async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("customer", "name email phone")
      .populate("property", "title location price")
      .populate("agent", "name email phone");
      
    if (!visit) return res.status(404).json({ success: false, message: "Visit not found" });

    res.json({ success: true, data: visit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Bulk import properties
// @route   POST /api/v1/admin/properties/bulk
// @access  Private/Admin
export const bulkImportProperties = async (req, res) => {
  try {
    const { properties } = req.body;
    
    if (!properties || !Array.isArray(properties)) {
      return res.status(400).json({ success: false, message: "Properties array is required." });
    }

    const results = {
      success: [],
      failed: []
    };

    for (let index = 0; index < properties.length; index++) {
      const propData = properties[index];
      const rowNum = propData._rowNum || (index + 1);
      
      try {
        // Validation: required fields
        if (!propData.title || !propData.price || !propData.propertyType || !propData.bedrooms || !propData.bathrooms || !propData.areaSqft) {
            throw new Error("Missing required fields (title, price, propertyType, bedrooms, bathrooms, areaSqft).");
        }
        
        // Invalid price
        if (isNaN(Number(propData.price)) || Number(propData.price) <= 0) {
            throw new Error("Invalid price.");
        }

        // Missing coordinates
        if (!propData.lng || !propData.lat || isNaN(Number(propData.lng)) || isNaN(Number(propData.lat))) {
            throw new Error("Missing or invalid coordinates (lng, lat).");
        }

        // Validate email format if provided
        if (propData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(propData.email)) {
                throw new Error("Wrong email format.");
            }
        }
        
        // Validate phone number if provided
        if (propData.phone) {
            const phoneRegex = /^[0-9\-\+\s\(\)]{10,15}$/; // basic validation
            if (!phoneRegex.test(propData.phone)) {
                throw new Error("Invalid phone number.");
            }
        }

        // Duplicate property title check
        const existingTitle = await Property.findOne({ title: propData.title });
        if (existingTitle) {
            throw new Error("Duplicate property title.");
        }

        // Address check duplicate
        if (propData.street && propData.city) {
            const existingAddress = await Property.findOne({ 
                "location.street": propData.street,
                "location.city": propData.city
            });
            if (existingAddress) {
                throw new Error("Duplicate property address.");
            }
        }

        // Image Auto Import
        let images = [];
        if (propData.imageUrls) {
            const urls = propData.imageUrls.split(',').map(u => u.trim()).filter(u => u);
            for (let i = 0; i < urls.length; i++) {
                try {
                    const result = await cloudinary.uploader.upload(urls[i], { folder: "property" });
                    images.push({
                        url: result.secure_url,
                        isFeatured: i === 0,
                        order: i,
                    });
                } catch (imgErr) {
                    console.log("Image upload failed for URL:", urls[i], imgErr.message);
                }
            }
        }

        // Generate slug
        const slug = await generateUniqueSlug(propData.title);
        
        // Validate property type
        const validTypes = ["house", "apartment", "condo", "penthouse", "villa", "townhouse", "land"];
        let pType = propData.propertyType.toLowerCase();
        if (!validTypes.includes(pType)) {
            pType = "house"; // fallback or throw error, let's fallback
        }

        const newPropData = {
            title: propData.title,
            slug,
            description: propData.description || "",
            status: propData.status || "for_sale",
            approvalStatus: "approved", 
            propertyType: pType,
            price: Number(propData.price),
            bedrooms: Number(propData.bedrooms),
            bathrooms: Number(propData.bathrooms),
            areaSqft: Number(propData.areaSqft),
            location: {
                street: propData.street || "",
                city: propData.city || "",
                state: propData.state || "",
                zip: propData.zip || "",
                country: propData.country || "India",
                coordinates: {
                    type: "Point",
                    coordinates: [Number(propData.lng), Number(propData.lat)]
                }
            },
            images: images,
            agent: req.user._id // current admin
        };

        const newProperty = new Property(newPropData);
        await newProperty.save();

        results.success.push({ rowNum, title: propData.title });

      } catch (err) {
        results.failed.push({ rowNum, error: err.message, title: propData.title || "Unknown" });
      }
    }

    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

