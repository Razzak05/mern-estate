import express from "express";
import { verifyUser } from "../middlewares/authMiddleware.js";
import { createListing } from "../controllers/listing.controller.js";

const router = express.Router();
router.post("/create", verifyUser, createListing);
export default router;
