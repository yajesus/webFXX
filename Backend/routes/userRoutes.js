const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authuser = require("../middlewares/userauth");
const InviteCode = require("../models/Invitecode");
router.post("/submit-task", authuser, userController.submitTask);
router.post("/request-withdrawal", authuser, userController.requestWithdrawal);
router.get(
  "/transaction-history/:userId",
  authuser,
  userController.getTransactionHistory
);
router.put("/update-password", authuser, userController.updatepassword);
router.put(
  "/update-withdrawal-password",
  authuser,
  userController.updatewithdrawalpassword
);
router.get("/invite-codes", async (req, res) => {
  try {
    const inviteCodes = await InviteCode.find();
    res.status(200).json({ inviteCodes });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
router.post("/bind-wallet", authuser, userController.bindWallet);
router.get("/Notification", authuser, userController.getNotifications);
router.put("/mark-as-read", authuser, userController.markAsRead);
router.post("/generate-invite-code", authuser, userController.userinvitecode);
router.get("/invite-code", authuser, userController.getInviteCode);
router.get("/users-invited-by", authuser, userController.getUsersInvitedBy);
module.exports = router;
