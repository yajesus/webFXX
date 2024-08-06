const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const User = require("./models/User");
const session = require("./middlewares/session.js");
const cors = require("cors");
require("./models/User");

const transactionsRoute = require("./middlewares/transactions.js");
dotenv.config();
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
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

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
app.use("/api", transactionsRoute);
// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
