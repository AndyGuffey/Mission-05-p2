const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { getStations, getStationById } = require("./stationLogic");
require("dotenv").config();

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Define routes
// app.use('/api/stations', require('./routes/stations'));
app.get("/api/stations", async (req, res) => {
  try {
    const data = await getStations(req.query);
    res.json(data);
  } catch (err) {
    console.error("GET /api/stations:", err);
    res.status(500).json({ error: "Failed to fetch stations" });
  }
});
app.get("/api/stations/:id", async (req, res) => {
  try {
    const doc = await getStationById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e) {
    console.error("GET /api/stations/:id", e);
    res.status(500).json({ error: "Failed to fetch station" });
  }
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
