import express from "express";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/update", verifyUser, updateUser);
router.delete("/delete", verifyUser, deleteUser);

export default router;
