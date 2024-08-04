const User = require("../models/User");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

exports.submitTask = async (req, res) => {
  const { userId, productId } = req.body;
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    return res.status(400).send("Invalid user ID or product ID");
  }
  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

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
  const { userId, amount, password } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user.verifyPassword(password)) {
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
