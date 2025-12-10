import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import propertyRoutes from "./routes/userRoutes.js"; // rename if needed
import redis from "redis";

// Load environment variables




dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUrl = process.env.MONGODBURL;

mongoose
  .connect(mongoUrl)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Error:", err.message));

// Default test route
app.get("/", (req, res) => {
  res.send("Real Estate API is running ✔");
});



// API Routes
app.use("/api/v1", propertyRoutes);
 

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at port ${PORT}`));
