import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }

    const connection = await mongoose.connect(
      "mongodb+srv://Dashboard:development123@cluster0.t56y4wl.mongodb.net/"
    );

    console.log(`✅ DB Connected to: ${connection.connection.host}`);
    return connection;
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    throw new Error("Database connection failed");
  }
};

export default connectDB;
