import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";
import path from "path";



dotenv.config();

const app = express();

app.use(express.static(path.join(process.cwd(), "frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend/build", "index.html"));
});
app.use(cors({
  origin: "*"  // for testing; later you can set your frontend URL
}));

app.use(express.json()); // parse JSON body

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB connection error:", err));

app.use(urlRoutes);

app.get("/", (req, res) => res.send("Hello MERN!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
