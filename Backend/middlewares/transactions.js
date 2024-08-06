const express = require("express");
const Transaction = require("../models/Transaction.js");
const router = express.Router();

// Middleware to check if user is logged in
async function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const user = await user.findById(req.session.userId);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error); // log the error for debugging purposes
    res.status(500).send("Server Error");
  }
}

// Route to get all transactions for the authenticated user
router.get("/transactions", isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.session.userId,
    }).populate("user", "username");
    res.json(transactions);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
