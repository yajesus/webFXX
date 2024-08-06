const User = require("../models/User");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

exports.submitTask = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

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
