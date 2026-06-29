import mongoose from "mongoose";

const connectDB = async (uri) => {
  const mongoUri = uri || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI is not defined. Set it in backend/.env locally or in Render Environment variables."
    );
  }

  if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
    throw new Error(
      "MONGODB_URI must start with mongodb:// or mongodb+srv://"
    );
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log(
      `✓ MongoDB Atlas connected successfully (${conn.connection.host}/${conn.connection.name})`
    );
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export const isDbConnected = () => mongoose.connection.readyState === 1;

export default connectDB;
