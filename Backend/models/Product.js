const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // URL of the image
  price: { type: Number, required: true },
  profit: { type: Number, required: true },
  isPremium: { type: Boolean, default: false },
  visibleTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who can see the premium product
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
