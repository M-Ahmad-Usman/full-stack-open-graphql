const mongoose = require("mongoose");

const connectToDatabase = async (uri) => {
  console.log("Connecting to MongoDB");

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(`error connection to MongoDB: `, error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
