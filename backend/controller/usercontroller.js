import Property from "../models/schema.js";
import Inquiry from "../models/Inquiry.js";
import Visit from "../models/Visit.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import redisClient from "../config/redis.js";
import { buildPropertyFilter } from "../utils/propertyFilter.js";
import qs from "qs";
// Generate a unique slug based on the title
async function generateUniqueSlug(title) {
  const base = slugify(title || "property", { lower: true, strict: true }); ///mainly use for SEO purpose and also url
  let slug = base;
  let i = 0;

  while (await Property.exists({ slug })) {
    // check that any same sulg same slug are present then change make unique slug
    i += 1;
    slug = `${base}-${Date.now().toString(36).slice(-4)}${i}`; // add new slug
    if (i > 5) break;
  }

  return slug;
}

// Helper to upload one buffer to Cloudinary
function uploadBufferToCloudinary(buffer, folder = "property", maxRetries = 2) {
  return new Promise((resolve, reject) => {
    const attempt = (retriesLeft) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "auto", timeout: 60000 },
        (error, result) => {
          if (error) {
            if (retriesLeft > 0 && (error.http_code === 502 || error.http_code === 499 || error.name === "UnexpectedResponse")) {
              console.warn(`Cloudinary upload returned ${error.http_code || error.message}, retrying (${retriesLeft} left)...`);
              return setTimeout(() => attempt(retriesLeft - 1), 1500);
            }
            return reject(error);
          }
          return resolve(result);
        }
      );
      uploadStream.end(buffer);
    };
    attempt(maxRetries);
  });
}

// CREATE property
export const Addproperty = async (req, res) => {
  try {
    const addproperty = req.body; // when user send data addproperty can get data

     addproperty.agent = req.user._id;

     if(req.user.role === 'owner') {
        addproperty.owner = req.user._id;
    }

    // ── Reconstruct nested location from flat FormData fields ─────────────
    // Multer does NOT auto-parse bracket notation (location[city] stays as
    // literal key).  Frontend sends flat keys: locationCity, locationStreet…
    if (addproperty.locationCity || addproperty.locationStreet || addproperty.locationState) {
      addproperty.location = {
        street:  addproperty.locationStreet  || '',
        city:    addproperty.locationCity    || '',
        state:   addproperty.locationState   || '',
        zip:     addproperty.locationZip     || '',
        country: addproperty.locationCountry || 'India',
      };
      // Remove the flat keys so Mongoose doesn't see them
      ['locationStreet','locationCity','locationState','locationZip','locationCountry']
        .forEach(k => delete addproperty[k]);
    }

    // ── Parse amenities — frontend sends a JSON string ────────────────────
    if (typeof addproperty.amenities === 'string') {
      try {
        addproperty.amenities = JSON.parse(addproperty.amenities);
      } catch {
        addproperty.amenities = [];
      }
    }

    // ── Cast FormData string values to correct JS types ───────────────────
    if (addproperty.isFeatured !== undefined)
      addproperty.isFeatured = addproperty.isFeatured === 'true';

    ['price','bedrooms','bathrooms','areaSqft','lotSize','yearBuilt','floors']
      .forEach(k => {
        if (addproperty[k] !== undefined && addproperty[k] !== '')
          addproperty[k] = Number(addproperty[k]);
      });

    // If slug not provided, generate one
    if (!addproperty.slug) {
      addproperty.slug = await generateUniqueSlug(addproperty.title);
    }

    // Handle images from multer (req.files)
    const files = req.files || [];
    if (files.length) {
      const uploads = await Promise.all(
        files.map((file) => uploadBufferToCloudinary(file.buffer, "property"))
      );

      // Match your mediaSchema: only url, isFeatured, caption, order
      addproperty.images = uploads.map((u, index) => ({
        url: u.secure_url,
        isFeatured: index === 0, // first one featured
        caption: "",
        order: index,
      }));
    }

    const newProperty = new Property(addproperty);
    const saved = await newProperty.save();

    // Invalidate cache
    try {
      await redisClient.del("property=list");
    } catch (cacheErr) {
      console.log("Redis cache invalidation failed:", cacheErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating property:", error);

    // Duplicate key (e.g., slug unique)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate key error",
        error: error.keyValue,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// LIST all property
export const listallproperty = async (req, res) => {
  try {
    const cashakey = "property=list";
    let cachedData = null;
    try {
      cachedData = await redisClient.get(cashakey);
    } catch (redisErr) {
      console.log("Redis get failed for listallproperty:", redisErr.message);
    }

    if (cachedData) {
      return res.status(200).json({
        source: "cache",
        data: JSON.parse(cachedData),
      });
    }

    const list = await Property.find();
    if (!list || list.length === 0) {
      return res.status(404).json({ msg: "No property found" });
    }

    try {
      await redisClient.set(cashakey, JSON.stringify(list), { EX: 60 });
    } catch (redisErr) {
      console.log("Redis set failed for listallproperty:", redisErr.message);
    }

    res.status(200).json({ source: "db", data: list });
  } catch (error) {
    console.error("Redis/List error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET single property & increment view counter
export const getsingleproperty = async (req, res) => {
  try {
    const id = req.params.id;

    // Atomically increment the view counter in MongoDB & populate agent
    const single = await Property.findByIdAndUpdate(
      id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate("agent", "name email phone");

    if (!single) {
      return res.status(404).json({ msg: "Property not found" });
    }

    res.status(200).json({ source: "db", data: single });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE Inquiry (from buyer)
export const createInquiry = async (req, res) => {
  try {
    const { propertyId, message, name, email, phone } = req.body;

    if (!propertyId || !message) {
      return res.status(400).json({ success: false, message: "Property ID and message are required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const inquiryData = {
      property: propertyId,
      message,
      customerName: name || req.user?.name || "Guest Buyer",
      customerEmail: email || req.user?.email || "",
      customerPhone: phone || req.user?.phone || "",
      assignedAgent: property.agent || property.owner,
      status: "New",
    };

    if (req.user?._id) {
      inquiryData.customer = req.user._id;
    }

    const inquiry = new Inquiry(inquiryData);
    await inquiry.save();

    res.status(201).json({
      success: true,
      message: "Your inquiry has been submitted! An agent will contact you shortly.",
      data: inquiry,
    });
  } catch (error) {
    console.error("Create inquiry error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE Visit / Tour Booking (from buyer)
export const createVisit = async (req, res) => {
  try {
    const { propertyId, visitDate, notes, name, email, phone } = req.body;

    if (!propertyId || !visitDate) {
      return res.status(400).json({ success: false, message: "Property ID and visit date are required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const visitData = {
      property: propertyId,
      visitDate: new Date(visitDate),
      notes: notes || "",
      customerName: name || req.user?.name || "Guest Buyer",
      customerEmail: email || req.user?.email || "",
      customerPhone: phone || req.user?.phone || "",
      agent: property.agent || property.owner,
      status: "Pending",
    };

    if (req.user?._id) {
      visitData.customer = req.user._id;
    }

    const visit = new Visit(visitData);
    await visit.save();

    res.status(201).json({
      success: true,
      message: "Tour scheduled successfully! The agent will confirm your appointment.",
      data: visit,
    });
  } catch (error) {
    console.error("Create visit error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// TOGGLE Favorite (increment/decrement favoritesCount)
export const toggleFavorite = async (req, res) => {
  try {
    const id = req.params.id;
    const { isFavorite } = req.body; // true = add favorite, false = remove

    const increment = isFavorite ? 1 : -1;
    const updated = await Property.findByIdAndUpdate(
      id,
      { $inc: { favoritesCount: increment } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    if (updated.favoritesCount < 0) {
      updated.favoritesCount = 0;
      await updated.save();
    }

    res.status(200).json({ success: true, favoritesCount: updated.favoritesCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE property
export const updateproperty = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await Property.findById(id);
    if (!existing) {
      return res.status(404).json({ msg: "Property not found" });
    }
    // Allow if user is ADMIN -OR- user is the creator (Agent/Owner)
    const isCreator = 
        existing.agent?.toString() === req.user._id.toString() || 
        existing.owner?.toString() === req.user._id.toString();

        if (req.user.role !== "admin" && !isCreator) {
        return res.status(403).json({ 
            msg: "Access denied. You can only update your own properties." 
        });
    }

    const updated = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Invalidate cache
    try {
      await redisClient.del(`property:${id}`);
      await redisClient.del("property=list");
    } catch (cacheErr) {
      console.log("Redis cache invalidation failed:", cacheErr.message);
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



// DELETE property
export const deleteproperty = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await Property.findById(id);

    if (!existing) {
      return res.status(404).json({ msg: "Property not found" });
    }

     // Allow if user is ADMIN -OR- user is the creator
    const isCreator = 
        existing.agent?.toString() === req.user._id.toString() || 
        existing.owner?.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !isCreator) {
        return res.status(403).json({ 
            msg: "Access denied. You can only delete your own properties." 
        });
    }

    const deleted = await Property.findByIdAndDelete(id);

    // Invalidate cache
    try {
      await redisClient.del(`property:${id}`);
      await redisClient.del("property=list");
    } catch (cacheErr) {
      console.log("Redis cache invalidation failed:", cacheErr.message);
    }

    res.status(200).json({
      msg: "Property deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



//filter Serch property
export const getFilteredproperty = async (req, res) => {
  try {
    // 1) Build filter from query (helper must use req.query values, not req)
    const filter = buildPropertyFilter(req.query);

    // 2) Pagination & limits (explicit numbers)
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    // 3) Sorting
    const sort = req.query.sort || "latest";
    const sortOption = {
      price_low: { price: 1 },
      price_high: { price: -1 },
      latest: { createdAt: -1 },
    };
    const sortBy = sortOption[sort] || { createdAt: -1 };

    // 4) Build a stable cache key using the original query string (safer than JSON.stringify(filter))
    //    qs.stringify produces a stable string from req.query (install qs)
    const queryString = qs.stringify(req.query, { sort: (a, b) => a.localeCompare(b) });
    const cacheKey = `properties:filter:${queryString}:page=${page}:limit=${limit}:sort=${sort}`;

    // 5) Check cache first
    let cachedData = null;
    try {
      cachedData = await redisClient.get(cacheKey);
    } catch (redisErr) {
      console.log("Redis get failed for getFilteredproperty:", redisErr.message);
    }
    
    if (cachedData) {
      return res.status(200).json({
        source: "cache",
        ...JSON.parse(cachedData),
      });
    }

    // 6) Query MongoDB (use lean for performance)
    const [properties, total] = await Promise.all([
      Property.find(filter).sort(sortBy).skip(skip).limit(limit).lean(),
      Property.countDocuments(filter),
    ]);

    const responseData = {
      success: true,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      properties,
    };

    // 7) Store in Redis with TTL (seconds)
    try {
      await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 60 });
    } catch (redisErr) {
      console.log("Redis set failed for getFilteredproperty:", redisErr.message);
    }

    res.status(200).json({
      source: "database",
      ...responseData,
    });
  } catch (error) {
    console.error("getFilteredproperty error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};