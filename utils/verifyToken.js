import jwt from "jsonwebtoken";
import Users from "../models/users.js";

export default async function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  let decoded = null;
  try {
    decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

    if (!decoded.user) {
      return res.status(401).json({ message: "Access denied" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }

  try {
    const user = await Users.findById(decoded.user._id);
    if (!user) {
      return res.status(401).json({ message: "Access denied" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}