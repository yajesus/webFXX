const Event = require("../models/Event");
const Product = require("../models/Product");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

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
  const { name, description, image, price, profit } = req.body;
  try {
    const product = new Product({ name, description, image, price, profit });
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
