const mongoose = require("mongoose");

const ZstationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Station name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Station address is required"],
      trim: true,
    },
    isOpen24Hours: {
      type: Boolean,
      default: false,
    },
    services: {
      type: [String],
      default: [],
      // Example services: ['Charging', 'Restroom', 'Food', 'Shop']
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0], // Default coordinates will be updated later
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Add geospatial index for location-based queries
ZstationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Zstation", ZstationSchema);
