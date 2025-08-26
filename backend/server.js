// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*" }));          // allow all origins for testing
app.use(express.json());                  // parse JSON request body

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB connection error:", err));

// Routes
app.use(urlRoutes);  // urlRoutes.js should have /api/shorten etc



// Test route to confirm server is running
app.get("/", (req, res) => {
  res.send("Hello MERN! Backend is running.");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
