const mongoose = require("mongoose");

const connDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database not connected", error);
    process.exit(1);
  }
};

module.exports = connDb;
