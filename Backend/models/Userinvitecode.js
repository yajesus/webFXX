const mongoose = require("mongoose");

const userInviteCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("UserInviteCode", userInviteCodeSchema);
