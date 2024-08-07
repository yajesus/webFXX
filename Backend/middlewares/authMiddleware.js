const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

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

    const adminId = decoded.id;
    console.log("Admin ID from token:", adminId);

    console.log("Admin found:", admin);
    if (!admin) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (admin.email !== "admin@example.com") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.Admin = admin; // Attach the admin object to the request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateAndAdmin;
