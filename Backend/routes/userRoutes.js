const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Middleware to ensure user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Unauthorized");
};

router.post("/submit-task", isAuthenticated, userController.submitTask);
router.post(
  "/request-withdrawal",
  isAuthenticated,
  userController.requestWithdrawal
);

module.exports = router;
