import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import propertyRoutes from "./routes/userRoutes.js";
import authRoutesrouter from "./routes/auth.routes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables first
dotenv.config();

const app = express();

// ── CORS — restrict to allowed origins from .env ──────────────────────────────
// Dev:  ALLOWED_ORIGINS=http://localhost:5173
// Prod: ALLOWED_ORIGINS=https://your-frontend.com,https://www.your-frontend.com
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin "${origin}" is not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

// ── MongoDB connection ─────────────────────────────────────────────────────────
if (!process.env.MONGODBURL) {
  console.error("❌ MONGODBURL is missing in backend/.env");
} else {
  mongoose
    .connect(process.env.MONGODBURL, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
      console.error("❌ MongoDB Error:", err.message);
      if (err.message.includes("ENOTFOUND")) {
        console.error("👉 The MongoDB Atlas cluster hostname could not be resolved. Verify your cluster URL in .env, or use local MongoDB (mongodb://127.0.0.1:27017/estate).");
      }
    });
}

// Health-check route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    env:  process.env.NODE_ENV || "development",
    message: "Real Estate API is running ✔",
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1", propertyRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/auth",   authRoutesrouter);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
);

// ── Global Error Handler ───────────────────────────────────────────────────────
// Ensures all errors (Multer, Mongoose, custom) return JSON, never HTML
app.use((err, req, res, next) => {
  console.error("⛔ Global Error Handler:", err.stack);
  
  // Handle Multer errors specifically if needed
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: "File too large (max 5MB)" });
  }

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only include stack in dev
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});







