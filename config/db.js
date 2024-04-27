const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("error");
    console.log(error);
  }
};

module.exports = connectDB;
