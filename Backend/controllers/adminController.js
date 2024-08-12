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
const PendingApproval = require("../models/Pendingapproval");
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    console.log(admin);
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
    const notification = new Notification({
      userId: user._id,
      message: `Your Balance has been edited now your balance is ${user.balance} `,
    });
    await notification.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveWithdrawal = async (req, res) => {
  const { withdrawalId } = req.body;

  try {
    // Find the withdrawal transaction by its ID
    const withdrawal = await Transaction.findById(withdrawalId).populate(
      "user"
    );

    // If the transaction is not found, return an error
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    // Check if the transaction is of type "withdrawal"
    if (withdrawal.type !== "withdrawal") {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Check if the withdrawal has already been approved
    if (withdrawal.status === "approved") {
      return res.status(400).json({ message: "Withdrawal already approved" });
    }

    // Find the user associated with this withdrawal
    const user = withdrawal.user;

    // Check if the user has sufficient balance
    if (user.balance < withdrawal.amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Subtract the withdrawal amount from the user's balance
    user.balance -= withdrawal.amount;

    // Save the updated user balance
    await user.save();

    // Update the withdrawal status to 'approved'
    withdrawal.status = "approved";
    await withdrawal.save();

    // Notify the user who made the withdrawal request
    const notification = new Notification({
      userId: user._id,
      message: `Your withdrawal request of ${withdrawal.amount} has been approved`,
    });
    await notification.save();

    // Return the updated withdrawal
    res.status(200).json(withdrawal);
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
      .populate("username phoneNumber") // Populate invited users with username and phoneNumber
      .populate("submittedProducts", "name") // Populate submitted products (assuming 'name' is a field in Product schema)
      .select("username phoneNumber wallet balance  submittedProducts"); // Select only required fields

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

    // Find the pending approval record
    const pendingApproval = await PendingApproval.findOne({
      userId,
      productId,
      isApproved: false,
    });

    if (!pendingApproval) {
      return res
        .status(400)
        .json({ message: "Pending product not found or already approved" });
    }

    // Mark as approved
    pendingApproval.isApproved = true;
    await pendingApproval.save();

    // Now find the user and product to update them
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: "User or product not found" });
    }

    // Add the product to the user's submitted products and update balance
    user.submittedProducts.push(productId);
    user.balance += product.profit;

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
exports.getPendingProducts = async (req, res) => {
  try {
    const pendingProducts = await PendingApproval.find({ isApproved: false })
      .populate("userId", "username email")
      .populate("productId", "name description price profit isPremium");

    res.status(200).json(pendingProducts);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching pending products" });
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
exports.toggleProductSubmission = async (req, res) => {
  const { userId, canSubmitProducts, colorState } = req.body;

  try {
    if (!userId || typeof canSubmitProducts !== "boolean" || !colorState) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.canSubmitProducts = canSubmitProducts;
    user.colorState = colorState; // Update color state
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
