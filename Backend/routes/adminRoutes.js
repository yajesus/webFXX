const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateJWT, isAdmin } = require("../middlewares/authMiddleware");

router.post("/login", adminController.adminLogin);

// Protected admin routes
router.post("/add-event", authenticateJWT, isAdmin, adminController.addEvent);
router.post(
  "/add-product",
  authenticateJWT,
  isAdmin,
  adminController.addProduct
);
router.post(
  "/edit-user-balance",
  authenticateJWT,
  isAdmin,
  adminController.editUserBalance
);
router.post(
  "/approve-withdrawal",
  authenticateJWT,
  isAdmin,
  adminController.approveWithdrawal
);
router.post(
  "/cancel-premium-product",
  authenticateJWT,
  isAdmin,
  adminController.cancelPremiumProduct
);

module.exports = router;
