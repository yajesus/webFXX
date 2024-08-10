const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticateAndAdmin = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
router.post("/login", adminController.adminLogin);

// Protected admin routes
router.post("/add-event", authenticateAndAdmin, adminController.addEvent);
router.post(
  "/add-product",
  upload.single("image"),
  authenticateAndAdmin,
  adminController.addProduct
);
router.put(
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
router.post(
  "/generate-invite-code",
  authenticateAndAdmin,
  adminController.generatecode
);
router.get(
  "/users-with-transactions",
  authenticateAndAdmin,
  adminController.userstransaction
);
module.exports = router;
