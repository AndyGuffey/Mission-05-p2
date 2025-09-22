const mongoose = require("mongoose");
const Zstation = require("../models/Zstations");
const stationData = require("./seedData");
require("dotenv").config();

// Connect to MongoDB
const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/zstations"
    );
    console.log("Connected to MongoDB");

    // Delete existing data
    await Zstation.deleteMany({});
    console.log("Deleted existing stations");

    // Insert new data
    const stations = await Zstation.insertMany(stationData);
    console.log(
      `Successfully added ${stations.length} stations to the database`
    );

    // Disconnect from the database
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
