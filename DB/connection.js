import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect("mongodb+srv://Dashboard:development123@cluster0.t56y4wl.mongodb.net/");

    console.log(`DB Connected successfully to: ${connection.connection.host}`);
    return connection;
  } catch (err) {
    console.error(`Failed to connect to DB: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
