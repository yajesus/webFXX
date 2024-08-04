const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("../config/database.js");

module.exports = session({
  secret: process.env.SESSION_SECRET, // Replace with a secure secret key
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    mongooseConnection: mongoose.connection,
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60, // Sessions expire after 14 days
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production", // Set to true in production
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // Cookies expire after 14 days
  },
});
