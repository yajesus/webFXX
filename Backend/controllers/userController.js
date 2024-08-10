const User = require("../models/User");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const validator = require("validator");
const WAValidator = require("multicoin-address-validator");
const Notification = require("../models/Notifications");
const UserInviteCode = require("../models/Userinvitecode");
const crypto = require("crypto");
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
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    console.log("incoming user:", user.username);
    if (product.isPremium && !product.visibleTo.includes(userId)) {
      return res.status(403).send("Not authorized to access premium product");
    }

    if (user.balance < 50) {
      return res.status(400).send("Insufficient balance");
    }

    user.balance += product.profit;
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  const userId = req.user.id; // Assuming user ID is included in the request object
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
  const { notificationId } = req.body;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    notification.read = true;
    await notification.save();
    res.status(200).send(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
