import express from "express";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { verifyUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/update", verifyUser, upload.single("avatar"), updateUser);
router.delete("/delete", verifyUser, deleteUser);

export default router;
