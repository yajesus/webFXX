// createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });
const createAdmin = async () => {
  const email = "admin@gmail.com";
  const password = "123admin"; // Replace with your secure password

  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);
    await mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.log(err));

    let admin = await Admin.findOne({ email });
    if (admin) {
      console.log("Admin already exists");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    admin = new Admin({
      email,
      password,
    });

    await admin.save();
    console.log("Admin created successfully");
    console.log("Stored Hashed Password:", admin.password);
  } catch (err) {
    console.error("Error creating admin:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
