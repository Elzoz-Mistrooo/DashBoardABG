import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.CONNECTION_DB_URL);

    console.log(`DB Connected successfully to: ${connection.connection.host}`);
    return connection;
  } catch (err) {
    console.error(`Failed to connect to DB: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
