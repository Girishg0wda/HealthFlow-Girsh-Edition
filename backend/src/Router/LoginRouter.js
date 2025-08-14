const express = require("express");
const {UserLogin} = require ("../Controller/LoginController");
const LoginRouter = express.Router();

LoginRouter.post("/", UserLogin);

module.exports = LoginRouter;
