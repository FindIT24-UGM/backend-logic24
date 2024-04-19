const express = require("express");
const {
  signInRequired,
  loginController,
  finishedExam
} = require("../controllers/auth");
const router = express.Router();

// Post API For Login
// Body: username, password
// RETURN: token, currentUser, currentId, answers, teamName
router.post("/login", signInRequired, loginController);

module.exports = router;
