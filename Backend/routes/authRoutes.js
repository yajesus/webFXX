const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const auth = require("../middlewares/auth");
const limit = require("../middlewares/ratelimit");
// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login, limit.loginLimiter);

// Reset password route
router.post("/reset-password", authController.resetPassword, auth);

module.exports = router;
