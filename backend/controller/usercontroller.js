import Property from "../models/schema.js";
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
function uploadBufferToCloudinary(buffer, folder = "property") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// CREATE property
export const Addproperty = async (req, res) => {
  try {
    const addproperty = req.body; // when user send data addproperty can get data

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
    await redisClient.del("property=list");

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
    const cachedData = await redisClient.get(cashakey);

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

    await redisClient.set(cashakey, JSON.stringify(list), { EX: 60 });

    res.status(200).json({ source: "db", data: list });
  } catch (error) {
    console.error("Redis/List error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET single property
export const getsingleproperty = async (req, res) => {
  try {
    const id = req.params.id;
    const cashakey = `property:${id}`;
    const cachedData = await redisClient.get(cashakey);

    if (cachedData) {
      return res.status(200).json({
        source: "cache",
        data: JSON.parse(cachedData),
      });
    }

    const single = await Property.findById(id);

    if (!single) {
      return res.status(404).json({ msg: "Property not found" });
    }

    await redisClient.set(cashakey, JSON.stringify(single), { EX: 60 });

    res.status(200).json({ source: "db", data: single });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    await redisClient.del(`property:${id}`);
    await redisClient.del("property=list");

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

    const deleted = await Property.findByIdAndDelete(id);

    // Invalidate cache
    await redisClient.del(`property:${id}`);
    await redisClient.del("property=list");

    res.status(200).json({
      msg: "Property deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// filter Serch property

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
    const cachedData = await redisClient.get(cacheKey);
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
    await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 60 });

    res.status(200).json({
      source: "database",
      ...responseData,
    });
  } catch (error) {
    console.error("getFilteredproperty error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};