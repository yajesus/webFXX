const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authuser = require("../middlewares/userauth");

router.post("/submit-task", authuser, userController.submitTask);
router.post("/request-withdrawal", authuser, userController.requestWithdrawal);

module.exports = router;
