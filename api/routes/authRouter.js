const express = require("express");
const {
  signInRequired,
  loginController,
  finishedExam,
} = require("../controllers/auth");
const router = express.Router();

const User = require("../models/UsersModel.js");

// Post API For Login
// Body: username, password
// RETURN: token, currentUser, currentId, answers, teamName
router.post("/login", loginController);
