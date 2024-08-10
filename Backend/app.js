const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const User = require("./models/User");
const Product = require("./models/Product.js");

const path = require("path");
const cors = require("cors");
dotenv.config();
const productsmiddleware = require("./middlewares/productsmiddleware.js");
require("./models/User");

const transactionsRoute = require("./middlewares/transactions.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://web-fx-git-master-yared-shibeshis-projects.vercel.app",
    ], // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Passport config
require("./config/passport")(passport);
// Route to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("username balance");
    res.json(users);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

app.get("/api/products", productsmiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const products = await Product.find({
      $or: [
        { visibleTo: userId },
        { visibleTo: { $exists: false } }, // Products that are visible to all users
      ],
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", transactionsRoute);
// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
