const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User"); // Ensure this matches your model definition

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "identifier", passwordField: "password" },
      async (identifier, password, done) => {
        try {
          const user = await User.findOne({
            $or: [{ username: identifier }, { phoneNumber: identifier }],
          });

          if (!user) {
            return done(null, false, { message: "Username not found" });
          }

          const isPasswordMatch = user.verifyPassword(password);
          if (!isPasswordMatch) {
            return done(null, false, { message: "Incorrect password" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
