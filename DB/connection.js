// DB/connection.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("🔁 Already connected to MongoDB");
      return mongoose.connection;
    }

    const connection = await mongoose.connect("mongodb+srv://Dashboard:Elmalky123456@cluster0.t56y4wl.mongodb.net/", {
      dbName: "Dashboard",
    });

    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw new Error("Database connection failed");
  }
};

export default connectDB;
