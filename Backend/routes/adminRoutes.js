const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticateAndAdmin = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
router.post("/login", adminController.adminLogin);
const { rejectWithdrawal } = require("../controllers/adminController");
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
router.get("/users", authenticateAndAdmin, adminController.getAllUsers);
router.post(
  "/reject-withdrawal",
  authenticateAndAdmin,
  adminController.rejectWithdrawal
);
router.post(
  "/approve-user",
  authenticateAndAdmin,
  adminController.approveUserToSubmitProducts
);
router.get(
  "/users-submitted-products",
  authenticateAndAdmin,
  adminController.getUsersWithSubmittedProducts
);
router.get(
  "/invite-codes",
  authenticateAndAdmin,
  adminController.getinvitecode
);
module.exports = router;
