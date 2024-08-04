const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "identifier", passwordField: "password" },
      (identifier, password, done) => {
        // Find user by username or phone number
        User.findOne({
          $or: [{ username: identifier }, { phoneNumber: identifier }],
        })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "No user found" });
            }

            // Match password
            if (!user.verifyPassword(password)) {
              return done(null, false, { message: "Password incorrect" });
            }

            return done(null, user);
          })
          .catch((err) => console.error(err));
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
