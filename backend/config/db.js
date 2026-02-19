const mongoose = require("mongoose");

const connectToDb = async() => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("Hello");
    
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (e) {
    console.error("Error connecting to MongoDB:", e.message);
  }
};

module.exports = connectToDb;