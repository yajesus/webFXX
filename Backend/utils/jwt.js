const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const generateToken = (user) => {
  return jwt.sign({ id: Admin._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
