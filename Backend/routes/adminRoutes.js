const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Middleware to ensure user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).send("Forbidden");
};

router.post("/add-event", isAdmin, adminController.addEvent);
router.post("/add-product", isAdmin, adminController.addProduct);
router.post("/edit-user-balance", isAdmin, adminController.editUserBalance);
router.post("/approve-withdrawal", isAdmin, adminController.approveWithdrawal);

module.exports = router;
