const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Database connected!");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
};

module.exports = connectDB;