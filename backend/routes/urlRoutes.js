import express from "express";
import { nanoid } from "nanoid";
import Url from "../models/Url.js";

const router = express.Router();

// --------------------
// POST: Create a new short URL
// --------------------
router.post("/api/shorten", async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: "longUrl is required" });

    const shortCode = nanoid(6);
    const newUrl = new Url({ longUrl, shortCode });
    await newUrl.save();

    res.json({ shortUrl: `http://localhost:5000/${shortCode}`, shortCode });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --------------------
// GET: Redirect short URL to long URL
// --------------------
router.get("/:shortcode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortcode });
    if (!url) return res.status(404).json({ error: "URL not found" });

    url.visitCount += 1;
    await url.save();

    res.redirect(url.longUrl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --------------------
// GET: List all URLs (admin)
// --------------------
router.get("/api/admin/all", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
