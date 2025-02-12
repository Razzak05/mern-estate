import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token)
      return res.status(401).json({ message: "Unauthorized: Token required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user)
      return res.status(401).json({ message: "Unauthorized: User not found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
