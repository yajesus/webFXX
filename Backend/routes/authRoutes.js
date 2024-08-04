const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

// Reset password route
router.post("/reset-password", authController.resetPassword);

module.exports = router;
