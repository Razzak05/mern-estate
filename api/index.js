import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();

const app = express();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
