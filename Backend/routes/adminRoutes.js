const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticateAndAdmin = require("../middlewares/authMiddleware");

router.post("/login", adminController.adminLogin);

// Protected admin routes
router.post("/add-event", authenticateAndAdmin, adminController.addEvent);
router.post("/add-product", authenticateAndAdmin, adminController.addProduct);
router.post(
  "/edit-user-balance",
  authenticateAndAdmin,

  adminController.editUserBalance
);
router.post(
  "/approve-withdrawal",
  authenticateAndAdmin,

  adminController.approveWithdrawal
);
router.post(
  "/cancel-premium-product",
  authenticateAndAdmin,

  adminController.cancelPremiumProduct
);

module.exports = router;
