const User = require("../models/User");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const validator = require("validator");
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
