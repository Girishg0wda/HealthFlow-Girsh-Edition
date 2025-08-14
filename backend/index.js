const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
require("dotenv").config();
const app = require("./app");

const Connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

Connect()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })

  .catch((error) => {
    console.error("Error starting server:", error);
  });
