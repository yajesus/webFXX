const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const authenticateAndAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("your token", token);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    console.log("Decoded token:", decoded);

    // console.log("Admin ID from token:", adminId);

    console.log("Admin found:", admin);
    if (!admin) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.admin = admin; // Attach the admin object to the request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateAndAdmin;
