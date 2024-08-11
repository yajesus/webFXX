const Admin = require("../models/Admin");
const Event = require("../models/Event");
const Product = require("../models/Product");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Notification = require("../models/Notifications");
const generateInviteCode = require("../middlewares/Invitecodemiddleware");
const InviteCode = require("../models/Invitecode");
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    console.log("Login request received with email:", email);
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Admin found, verifying password", isMatch);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid password" });
    }
    console.log("Password verified, generating token");
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("Token generated successfully");
    res.status(200).json({ admin, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addEvent = async (req, res) => {
  const { title, content, image } = req.body;
  try {
    const event = new Event({ title, content, image });
    await event.save();
    // Notify all users
    const users = await User.find({}, "_id");
    const notifications = users.map(
      (user) =>
        new Notification({
          userId: user._id,
          message: `A new event has been added: ${title}`,
        })
    );
    await Notification.insertMany(notifications);
    res.status(201).send(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProduct = async (req, res) => {
  const { name, description, price, profit, isPremium, visibleTo } = req.body;
  const image = req.file ? req.file.path : null; // Handle image file

  if (!name || !description || !image || !price || !profit) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }
  try {
    let visibleToArray;
    if (visibleTo === "all") {
      const allUsers = await User.find({}, "_id"); // Fetch all user IDs
      visibleToArray = allUsers.map((user) => user._id);
    } else {
      visibleToArray = JSON.parse(visibleTo).map(
        (id) => new mongoose.Types.ObjectId(id)
      );
    }
    console.log("Visible To Array:", visibleToArray);
    const product = new Product({
      name,
      description,
      image,
      price,
      profit,
      isPremium,
      visibleTo: visibleToArray,
    });
    await product.save();
    // Notify all users
    const users = await User.find({}, "_id");
    const notifications = users.map(
      (user) =>
        new Notification({
          userId: user._id,
          message: `A new product has been added: ${name}`,
        })
    );
    await Notification.insertMany(notifications);
    res.status(201).send(product);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.editUserBalance = async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.balance += amount;
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveWithdrawal = async (req, res) => {
  const { withdrawalId } = req.body;
  console.log(withdrawalId);
  try {
    const withdrawal = await Transaction.findById(withdrawalId);
    withdrawal.status = "approved";
    await withdrawal.save();
    // Notify all users
    const users = await User.find({}, "_id");
    const notifications = users.map(
      (user) =>
        new Notification({
          userId: user._id,
          message: `A withdrawal request has been approved`,
        })
    );
    await Notification.insertMany(notifications);
    res.status(200).send(withdrawal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelPremiumProduct = async (req, res) => {
  const { productId, userId } = req.body;
  try {
    const product = await Product.findById(productId);
    product.visibleTo = product.visibleTo.filter(
      (id) => id.toString() !== userId
    );
    await product.save();
    res.status(200).send(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.generatecode = async (req, res) => {
  try {
    const code = await generateInviteCode();
    res.status(200).json({ code });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate invite code" });
  }
};
exports.userstransaction = async (req, res) => {
  try {
    // Find all transactions and populate the user field
    const transactions = await Transaction.find({ status: "pending" }).populate(
      "user"
    );

    // Extract unique users from the transactions
    const usersWithTransactions = transactions
      .map((transaction) => transaction.user)
      .filter(
        (value, index, self) =>
          self.findIndex(
            (user) => user._id.toString() === value._id.toString()
          ) === index
      );
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No pending transactions found" });
    }
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Fetch details of all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("invitedUsers", "username phoneNumber") // Populate invited users with username and phoneNumber
      .populate("submittedProducts", "name") // Populate submitted products (assuming 'name' is a field in Product schema)
      .select(
        "username phoneNumber wallet balance invitedUsers submittedProducts"
      ); // Select only required fields

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.rejectWithdrawal = async (req, res) => {
  const { withdrawalId } = req.body;

  try {
    const withdrawal = await Transaction.findById(withdrawalId);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal request not found" });
    }

    if (withdrawal.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending withdrawals can be rejected" });
    }

    withdrawal.status = "rejected";
    await withdrawal.save();

    res
      .status(200)
      .json({ message: "Withdrawal request rejected", withdrawal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Approve user to submit products
exports.approveUserToSubmitProducts = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId).populate("submittedProducts");

    if (!user) return res.status(404).json({ message: "User not found" });

    const product = user.submittedProducts.find(
      (product) => product._id.toString() === productId && !product.isApproved
    );

    if (!product) {
      return res
        .status(400)
        .json({ message: "Product not found or already approved" });
    }

    // Update product approval status
    product.isApproved = true;
    await product.save();

    // Calculate profit and update user's balance
    const profit = product.profit;
    user.balance += profit;
    await user.save();

    res.status(200).json({
      message: "Product approved successfully, balance updated",
      balance: user.balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get users who have submitted products
exports.getUsersWithSubmittedProducts = async (req, res) => {
  try {
    const users = await User.find()
      .populate({
        path: "submittedProducts",
        match: { isApproved: false }, // Only include unapproved products
      })
      .exec();

    // Filter out users who have no unapproved products left
    const filteredUsers = users.filter(
      (user) => user.submittedProducts.length > 0
    );

    res.status(200).json(filteredUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getinvitecode = async (req, res) => {
  try {
    const inviteCodes = await InviteCode.find(); // Retrieve all invite codes
    res.status(200).json(inviteCodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
