const User = require("../models/User");
const bcrypt = require("bcryptjs");
const InviteCode = require("../models/Invitecode");
const Userinvitecode = require("../models/Userinvitecode");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { parsePhoneNumberFromString } = require("libphonenumber-js");
const { body, validationResult } = require("express-validator");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
console.log("your jwt scret", JWT_SECRET);
// Sanitize and validate inputs for registration
exports.register = [
  // Input sanitization and validation
  body("username").trim().escape(),
  body("phoneNumber")
    .trim()
    .escape()
    .custom((value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (!phoneNumber || !phoneNumber.isValid()) {
        throw new Error("Invalid phone number");
      }
      return true;
    }),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("withdrawalPassword")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Withdrawal password must be at least 6 characters"),
  body("invitationCode").trim().escape(),

  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      username,
      phoneNumber,
      password,
      withdrawalPassword,
      invitationCode,
    } = req.body;
    console.log("Request body:", req.body);
    try {
      //check invitecode
      const inviteCode = await InviteCode.findOne({
        code: invitationCode,
        used: false,
      });
      const userInviteCode = await Userinvitecode.findOne({
        code: invitationCode,
        expiresAt: { $gt: new Date() }, // Check if the code is not expired
        // Check if the code is not used by the current user
      });

      if (!inviteCode && !userInviteCode) {
        return res.status(400).json({
          message: "Invalid, expired, or already used invitation code.",
        });
      }
      // Check if user already exists
      let user =
        (await User.findOne({ username })) ||
        (await User.findOne({ phoneNumber }));
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user
      user = new User({
        username,
        phoneNumber,
        password,
        withdrawalPassword,
        invitationCode,
      });

      await user.save();
      // Update the UserInviteCode to include the new user in usedBy
      if (userInviteCode) {
        userInviteCode.usedBy.push(user._id);
        await userInviteCode.save();
      }
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

// Sanitize and validate inputs for login
exports.login = [
  body("identifier").trim().escape(),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  async (req, res, next) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, password } = req.body;

    try {
      // Find user by username or phone number
      const user = await User.findOne({
        $or: [{ username: identifier }, { phoneNumber: identifier }],
      });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      console.log("user find", user);
      console.log("your jwt scret", JWT_SECRET);
      // Check password
      const isMatch = await user.verifyPassword(password);

      console.log("user", isMatch);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({ userId: user._id, token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

exports.resetPassword = async (req, res) => {
  const { userId, newPassword, newWithdrawalPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.withdrawalPassword = await bcrypt.hash(newWithdrawalPassword, 10);
    await user.save();

    res.status(200).json({ message: "Passwords updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
