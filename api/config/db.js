import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error(" Database connection failed:", error.message);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
