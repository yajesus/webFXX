const mongoose = require("mongoose");

const PendingApprovalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  isApproved: { type: Boolean, default: false },
});

module.exports = mongoose.model("PendingApproval", PendingApprovalSchema);
