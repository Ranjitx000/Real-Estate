
function escapeRegExp(string = "") {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const buildPropertyFilter = (query = {}) => {
  const {
    city,
    state,
    minPrice,
    maxPrice,
    status,
    propertyType,
    price,
    bedrooms,
    amenities,
    tags,
    parking,
    minArea,
    maxArea,
    search,
  } = query;

  const filter = {};

  // City / State (case-insensitive exact match)
  if (city) {
    const safe = escapeRegExp(city.trim());
    filter["location.city"] = new RegExp(`^${safe}$`, "i");
  }
  if (state) {
    const safe = escapeRegExp(state.trim());
    filter["location.state"] = new RegExp(`^${safe}$`, "i");
  }

  // Exact price override (if provided)
  if (price !== undefined) {
    const p = Number(price);
    if (!isNaN(p)) filter.price = p;
  }

  // Status & property type
  if (status) filter.status = status;
  if (propertyType) filter.propertyType = propertyType;

  // Bedrooms (integer)
  if (bedrooms !== undefined) {
    const b = Number(bedrooms);
    if (!isNaN(b)) filter.bedrooms = b;
  }

  // Parking — treat as string (e.g. "2-car garage")
  if (parking) filter.parking = parking;

  // Price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    const min = Number(minPrice);
    const max = Number(maxPrice);
    filter.price = filter.price || {}; // merge with exact price if set earlier
    if (!isNaN(min)) filter.price.$gte = min;
    if (!isNaN(max)) filter.price.$lte = max; 

    // If price ended up empty (both invalid), delete it
    if (Object.keys(filter.price).length === 0) delete filter.price;
  }

  // Area range (sqft)
  if (minArea !== undefined || maxArea !== undefined) {
    const min = Number(minArea);
    const max = Number(maxArea);
    filter.areaSqft = {};
    if (!isNaN(min)) filter.areaSqft.$gte = min;
    if (!isNaN(max)) filter.areaSqft.$lte = max;
    if (Object.keys(filter.areaSqft).length === 0) delete filter.areaSqft;
  }

  // Amenities (property must include ALL listed amenities)
  if (amenities) {
    const arr = amenities
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (arr.length) filter["amenities.label"] = { $all: arr };
  }

  // Tags (at least one)
  if (tags) {
    const arr = tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (arr.length) filter.tags = { $in: arr };
  }

  // Text search (title OR description)
  if (search) {
    const s = escapeRegExp(String(search).trim());
    if (s.length) {
      filter.$or = [
        { title: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
      ];
    }
  }

  return filter;
};
