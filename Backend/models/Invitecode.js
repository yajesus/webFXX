const mongoose = require("mongoose");

const inviteCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  used: { type: Boolean, default: false },
});

const InviteCode = mongoose.model("InviteCode", inviteCodeSchema);

module.exports = InviteCode;
