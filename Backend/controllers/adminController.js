const Admin = require("../models/Admin");
const Event = require("../models/Event");
const Product = require("../models/Product");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { generateToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    console.log("Login request received with email:", email);
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }
    console.log("Admin found, verifying password");
    const isMatch = await admin.verifyPassword(password);
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
    res.status(201).send(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProduct = async (req, res) => {
  const { name, description, image, price, profit, isPremium, visibleTo } =
    req.body;
  try {
    const product = new Product({
      name,
      description,
      image,
      price,
      profit,
      isPremium,
      visibleTo,
    });
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editUserBalance = async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const user = await User.findById(userId);
    user.balance += amount;
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveWithdrawal = async (req, res) => {
  const { withdrawalId } = req.body;
  try {
    const withdrawal = await Transaction.findById(withdrawalId);
    withdrawal.status = "approved";
    await withdrawal.save();
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
