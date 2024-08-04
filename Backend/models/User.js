const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true }, // Sparse allows for null/empty values without unique constraint conflict
  phoneNumber: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 30 },
  invitationCode: { type: String, unique: true },
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  walletAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Password hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
