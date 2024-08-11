const User = require("../models/User");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const validator = require("validator");
const WAValidator = require("multicoin-address-validator");
const Notification = require("../models/Notifications");
const UserInviteCode = require("../models/Userinvitecode");
const crypto = require("crypto");
const Events = require("../models/Event");
const { check, validationResult } = require("express-validator");
// Utility function to validate wallet address
const validateWalletName = (name) => {
  // Example: Wallet name must be between 3 and 50 characters and only contain alphanumeric characters and spaces
  return /^[a-zA-Z0-9 ]{3,50}$/.test(name);
};

exports.bindWallet = async (req, res) => {
  const { userId, walletName, walletAddress, walletPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!validateWalletName(walletName)) {
      return res.status(400).json({
        message:
          "Invalid wallet name. It should be 3-50 characters long and contain only letters, numbers, and spaces.",
      });
    }
    const isValidAddress = WAValidator.validate(walletAddress, "ETH");
    if (!isValidAddress) {
      return res.status(400).json({ message: "Invalid wallet address" });
    }

    // Set the wallet information
    user.wallet = {
      walletName,
      walletAddress,
      walletPassword, // This will be hashed automatically in the pre-save hook
    };

    await user.save();

    res
      .status(200)
      .json({ message: "Wallet bound successfully", wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitTask = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Find the user and the product
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: "User or product not found" });
    }

    // Check if the product is premium
    if (product.isPremium) {
      // Contact customer service for premium products
      // Replace this with actual logic for contacting customer service
      console.log(
        `Contacting customer service for user ${userId} and product ${productId}`
      );
      // You may use a service or send an email here
      return res.status(400).json({ message: "Contact customer services" });
    }

    // Check user's balance
    if (product.isPremium || user.balance >= 100) {
      // Add the product to the user's submitted products
      user.submittedProducts.push(productId);

      await user.save();

      return res
        .status(200)
        .json({ message: "Product submitted successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Insufficient balance for non-premium product" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred" });
  }
};

exports.requestWithdrawal = async (req, res) => {
  const { userId, amount, withdrawalPassword } = req.body;

  try {
    console.log("Request body:", req.body); // Log the request body

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log("Withdrawal password provided:", withdrawalPassword); // Log the provided withdrawal password
    console.log("Stored password hash:", user.password); // Log the stored user password hash

    // Check if the password is a string and not undefined
    if (
      typeof withdrawalPassword !== "string" ||
      typeof user.password !== "string"
    ) {
      console.log(
        "Invalid password types:",
        typeof withdrawalPassword,
        typeof user.password
      );
      return res.status(400).send("Invalid password");
    }

    const isPasswordValid = user.verifyWithdrawalPassword(withdrawalPassword);
    console.log("Is password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).send("Invalid withdrawal password");
    }

    const transaction = new Transaction({
      user: userId,
      type: "withdrawal",
      amount,
    });
    await transaction.save();
    res.status(201).send(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get transaction history
exports.getTransactionHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ user: userId }).sort({
      createdAt: -1,
    });

    if (!transactions) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updatepassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  // Input validation
  if (!validator.isLength(newPassword, { min: 6 })) {
    return res.status(400).json({ message: "please enter strong password" });
  }

  try {
    // Find user by username
    const user = await User.findById(userId);
    console.log("user id", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await user.verifyPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Validate and hash new password
    if (!validator.isStrongPassword(newPassword, { minLength: 8 })) {
      return res.status(400).json({ message: "Password is not strong enough" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.updatewithdrawalpassword = async (req, res) => {
  const { userId, oldWithdrawalPassword, newWithdrawalPassword } = req.body;

  // Input validation
  if (!validator.isLength(newWithdrawalPassword, { min: 6 })) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    // Find user by username
    const user = await User.findById(userId);
    console.log("user id", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old withdrawal password
    const isMatch = await user.verifyWithdrawalPassword(oldWithdrawalPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect old withdrawal password" });
    }

    // Validate and hash new withdrawal password
    if (!validator.isStrongPassword(newWithdrawalPassword, { minLength: 8 })) {
      return res
        .status(400)
        .json({ message: "Withdrawal password is not strong enough" });
    }

    user.withdrawalPassword = newWithdrawalPassword;
    await user.save();

    res
      .status(200)
      .json({ message: "Withdrawal password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.getNotifications = async (req, res) => {
  const userId = req.query.userId; // Assuming user ID is included in the request object
  try {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { ids } = req.body; // Get IDs from request body
    await Notification.updateMany(
      { _id: { $in: ids }, read: false },
      { read: true }
    );
    res.status(200).json({ message: "Selected notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};
exports.userinvitecode = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    console.log("user find", user);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log("user", userId);
    const code = crypto.randomBytes(6).toString("hex"); // Generate a unique invite code
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Code expires in 30 days
    const inviteCode = new UserInviteCode({
      code,
      createdBy: user._id,
      expiresAt,
    });
    await inviteCode.save();
    res.status(201).json(inviteCode);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// controllers/inviteCodeController.js
exports.getInviteCode = async (req, res) => {
  const { userId } = req.query; // Assuming userId is attached to the request
  console.log("user", userId);
  try {
    if (!userId) {
      return res.status(404).json({ message: "No user find" });
    }
    const inviteCode = await UserInviteCode.findOne({ createdBy: userId }).sort(
      { createdAt: -1 }
    );
    if (!inviteCode) {
      return res.status(404).json({ message: "No invite code found" });
    }
    res.status(200).json(inviteCode);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Fetch users invited by a specific user
exports.getUsersInvitedBy = async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters
  console.log("query or user id", userId);

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find invite codes created by the user
    const inviteCodes = await UserInviteCode.find({ createdBy: userId });
    console.log(inviteCodes);

    // Check if inviteCodes array is empty
    if (inviteCodes.length === 0) {
      return res
        .status(404)
        .json({ message: "No invite codes found for this user" });
    }

    // Extract and sort the usedBy arrays from invite codes
    const usedByUserIds = inviteCodes
      .flatMap((code) => code.usedBy) // Flatten the usedBy arrays
      .filter((id) => id) // Filter out undefined/null ids
      .reduce(
        (unique, id) => (unique.includes(id) ? unique : [...unique, id]),
        []
      ); // Remove duplicates

    // Find users by the usedByUserIds
    const users = await User.find({ _id: { $in: usedByUserIds } });

    // Check if users array is empty
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found for the invite codes" });
    }

    // Sort users by their _id to maintain order
    users.sort(
      (a, b) =>
        usedByUserIds.indexOf(a._id.toString()) -
        usedByUserIds.indexOf(b._id.toString())
    );

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Events.find().sort({ createdAt: -1 }); // Fetch all events sorted by newest first

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { username, invitationCode } = req.body;

    // Find the user by username and invitation code
    const user = await User.findOne({ username, invitationCode });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or invalid invitation code" });
    }

    // If the user is found, proceed to allow password reset
    // You can return a token or directly proceed to password reset logic
    res.status(200).json({
      message:
        "Username and invitation code verified. Proceed to reset password.",
      userId: user._id, // Optionally return the userId for next steps
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const isStrongPassword = (password) => {
  // Example password strength requirements:
  // At least 8 characters long
  // Contains at least one uppercase letter
  // Contains at least one lowercase letter
  // Contains at least one digit
  // Contains at least one special character
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(password);
};
exports.newPassword = [
  // Validation and sanitization
  check("userId").isMongoId().withMessage("Invalid user ID"),
  check("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom((value) => isStrongPassword(value))
    .withMessage("Password is not strong enough"),

  // Route handler
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, newPassword } = req.body;
    console.log("userid", userId);
    if (!userId || !newPassword) {
      return res
        .status(400)
        .json({ message: "User ID and new password are required" });
    }

    try {
      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the user's password (assume hashing is handled elsewhere)
      user.password = newPassword; // Password will be hashed before saving
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
