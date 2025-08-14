require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/Model/LoginModel");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URL);

  const email = "admin@admin.com";
  const plainPassword = "admin123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("✅ Admin already exists");
    return;
  }

  const newUser = new User({
    email,
    password: hashedPassword,
  });

  await newUser.save();
  console.log("✅ Admin user created successfully");

  mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error("❌ Error creating admin:", err);
});
