import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

export const updateUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Handle image upload if there's a file
    if (req.file) {
      try {
        // If there's an existing avatar URL and it's not the default, delete it from Cloudinary
        if (user.avatar && !user.avatar.includes("blank-profile-picture")) {
          const publicId = user.avatar.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`userprofiles/${publicId}`);
        }

        // Upload new image to cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "realestate/userprofiles",
              resource_type: "auto",
              transformation: [
                { width: 500, height: 500, crop: "fill" },
                { quality: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(req.file.buffer);
        });

        // Update user's avatar with new image URL
        user.avatar = result.secure_url;
      } catch (error) {
        return next(
          new Error("Error uploading image to Cloudinary: " + error.message)
        );
      }
    }

    // Update other fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save user and send response
    const updatedUser = await user.save();
    const { password: pass, ...userData } = updatedUser._doc;

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.avatar && !user.avatar.includes("blank-profile-picture")) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`userprofiles/${publicId}`);
    }
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
