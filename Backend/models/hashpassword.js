const bcrypt = require("bcryptjs");

const password = "yourPlainTextPassword"; // Replace with your actual plain text password

bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed password:", hashedPassword);
  }
});
