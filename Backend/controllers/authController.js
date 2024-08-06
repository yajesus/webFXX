const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const passport = require("passport");

exports.register = async (req, res) => {
  const {
    username,
    phoneNumber,
    password,
    withdrawalPassword,
    invitationCode,
  } = req.body;
  console.log("Received data:", req.body);
  // Check for missing fields
  if (!username || !phoneNumber) {
    return res
      .status(400)
      .json({ message: "Username and phone number are required" });
  }

  if (!password || !withdrawalPassword) {
    return res
      .status(400)
      .json({ message: "Password and withdrawal password are required" });
  }

  if (!invitationCode) {
    return res.status(400).json({ message: "Invitation code is required" });
  }

  // Validate phone number
  if (!validator.isMobilePhone(phoneNumber, "any")) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  try {
    const user = new User({
      username,
      phoneNumber,
      password,
      withdrawalPassword,
      invitationCode,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("Received data:", user);
    if (err) return next(err);

    // Check if user is provided
    if (!user) {
      // Handle specific error messages from Passport
      if (info.message === "Username not found") {
        return res.status(400).json({ message: "Username not found" });
      } else if (info.message === "Incorrect password") {
        return res.status(400).json({ message: "Incorrect password" });
      } else {
        return res.status(400).json({ message: "Authentication failed" });
      }
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json(user); // Send user data or token
    });
  })(req, res, next);
};

exports.resetPassword = async (req, res) => {
  const { userId, newPassword, newWithdrawalPassword } = req.body;
  try {
    const user = await User.findById(userId);
    user.password = await bcrypt.hash(newPassword, 10);
    user.withdrawalPassword = await bcrypt.hash(newWithdrawalPassword, 10);
    await user.save();
    res.status(200).json({ message: "Passwords updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
