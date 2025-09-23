const express = require("express");
const router = express.Router();
const Zstation = require("../models/Zstations");

// GET all stations
router.get("/", async (req, res) => {
  try {
    const stations = await Zstation.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET station by ID
router.get("/:id", async (req, res) => {
  try {
    const station = await Zstation.findById(req.params.id);
    if (!station) return res.status(404).json({ message: "Station not found" });
    res.json(station);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
