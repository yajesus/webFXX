const Admin = require("../models/Admin");
const Event = require("../models/Event");
const Product = require("../models/Product");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { generateToken } = require("../utils/jwt");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    console.log(email, password);
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await admin.verifyPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(admin);
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
