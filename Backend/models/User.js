const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const WalletSchema = new mongoose.Schema({
  walletName: { type: String, required: true },
  walletAddress: { type: String, required: true, unique: true },
  walletPassword: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  phoneNumber: { type: String, unique: true, sparse: true },

  password: { type: String, required: true },
  withdrawalPassword: { type: String, required: true },
  balance: { type: Number, default: 0 },
  wallet: { type: WalletSchema }, // Embedding WalletSchema
  role: { type: String, default: "user", enum: ["user", "admin"] },
  createdAt: { type: Date, default: Date.now },
  invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  invitationCode: { type: String, sparse: true },

  submittedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

// Password hashing for user and wallet password
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified("withdrawalPassword")) {
    const salt = await bcrypt.genSalt(10);
    this.withdrawalPassword = await bcrypt.hash(this.withdrawalPassword, salt);
  }
  if (this.isModified("wallet.walletPassword")) {
    const salt = await bcrypt.genSalt(10);
    this.wallet.walletPassword = await bcrypt.hash(
      this.wallet.walletPassword,
      salt
    );
  }
  next();
});

// Methods to verify passwords
UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.verifyWithdrawalPassword = function (password) {
  return bcrypt.compareSync(password, this.withdrawalPassword);
};

UserSchema.methods.verifyWalletPassword = function (password) {
  return bcrypt.compareSync(password, this.wallet.walletPassword);
};

module.exports = mongoose.model("User", UserSchema);
