const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true, required: true },
  phoneNumber: { type: String, unique: true, sparse: true, required: true },
  password: { type: String, required: true },
  withdrawalPassword: { type: String, required: true }, // Added withdrawalPassword field
  balance: { type: Number, default: 30 },
  invitationCode: { type: String, unique: true },
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  walletAddress: { type: String },

  createdAt: { type: Date, default: Date.now },
});

// Password hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") && !this.isModified("withdrawalPassword")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified("withdrawalPassword")) {
    this.withdrawalPassword = await bcrypt.hash(this.withdrawalPassword, salt);
  }
  next();
});

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.verifyWithdrawalPassword = function (password) {
  return bcrypt.compareSync(password, this.withdrawalPassword);
};

module.exports = mongoose.model("User", UserSchema);
