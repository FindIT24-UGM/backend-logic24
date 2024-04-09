const express = require("express");
const router = express.Router();

const { getTeamsScore, getTeamsAnswer } = require("../controllers/Admin");

// GET API for admin to get score
// BODY: username, teamname
// RETURN: teamname, score
router.post("/score", getTeamsScore);

// GET API for admin to get answers of all users
// BODY: -
// RETURN: username, answer
router.get("/answer", getTeamsAnswer);

module.exports = router;
