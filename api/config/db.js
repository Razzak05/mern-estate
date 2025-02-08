import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to database");
  } catch (error) {
    console.error("Something went wrong while connecting to DB:", error);
  }
};

export default connectDB;
