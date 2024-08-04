const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
exports.register = async (req, res) => {
  const { username, phoneNumber, password, invitationCode } = req.body;
  try {
    let user = new User({ username, phoneNumber, password, invitationCode });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json(user);
    });
  })(req, res, next);
};

exports.resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
