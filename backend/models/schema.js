import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    icon: { type: String }, // optional: name/key to map in frontend
  },
  { _id: false }
);             

const locationSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true, index: true },
    state: { type: String, trim: true, index: true },
    zip: { type: String, trim: true },
    country: { type: String, trim: true, default: "India" },
    coordinates: {
      // GeoJSON point for map & nearby search
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      // [lng, lat]
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
  },
  { _id: false }
);

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    caption: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    // Basic
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true }, // for SEO URLs
    description: { type: String, trim: true },

    status: {
      type: String,
      enum: ["for_sale", "for_rent", "sold", "off_market"],
      default: "for_sale",
      index: true,
    },
    propertyType: {
      type: String,
      enum: ["house", "apartment", "condo", "penthouse", "villa", "townhouse", "land"],
      required: true,
      index: true,
    },
   
    // Pricing
    price: { type: Number, required: true, index: true },
    currency: { type: String, default: "INR" },
    // Optional rental-specific
    rentFrequency: { type: String, enum: ["monthly", "yearly", null], default: null },
    hoaFees: { type: Number }, // monthly / yearly
    taxesAnnual: { type: Number },
    isNegotiable: { type: Boolean, default: false },

    // Specs
    bedrooms: { type: Number, required: true, index: true },
    bathrooms: { type: Number, required: true, index: true },
    areaSqft: { type: Number, required: true, index: true },
    lotSize: { type: Number }, // acres or sq.ft (document unit in UI)
    parking: { type: String }, // "3-car garage", etc.
    yearBuilt: { type: Number },
    floors: { type: Number },
    ownershipType: { type: String, enum: ["freehold", "leasehold", "other"], default: "freehold" },

    // Location
    location: locationSchema,

    // Media
    images: [mediaSchema],
    videoUrl: { type: String },
    virtualTourUrl: { type: String },

    // Amenities & tags
    amenities: [amenitySchema], // persisted labels (e.g. "Infinity pool", "Gym")
    tags: [{ type: String, trim: true, index: true }], // lifestyle tags: "ocean_view", "new_build"

    // Scores / neighborhood (optional, can be computed later)
    neighborhood: {
      safetyScore: { type: Number, min: 0, max: 10 },
      walkScore: { type: Number, min: 0, max: 100 },
      transitScore: { type: Number, min: 0, max: 100 },
      lifestyle: [{ type: String, trim: true }], // "Coastal trails", "Oceanfront dining"
    },

    // Relations
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Meta
    isFeatured: { type: Boolean, default: false, index: true },
    viewsCount: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["for_sale", "for_rent", "sold", "off_market"],
        },
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Helpful indexes for search page
propertySchema.index({ price: 1, bedrooms: 1, bathrooms: 1 });
propertySchema.index({ "location.city": 1, "location.state": 1 });
propertySchema.index({ propertyType: 1, status: 1 });
propertySchema.index({ tags: 1 });

const Property = mongoose.model("Property", propertySchema);
export default Property;
