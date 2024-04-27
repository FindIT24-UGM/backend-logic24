const express = require("express");
const router = express.Router();

const { getTeamsScore, getTeamsAnswer, getReportedQuestion, getParticipants, uploadAnswer, registerController } = require("../controllers/admin");

// GET API for admin to get score
// BODY: username, teamname
// RETURN: teamname, score
router.post("/score", getTeamsScore);

// GET API for admin to get answers of all users
// BODY: -
// RETURN: username, answer
router.get("/answer", getTeamsAnswer);

router.get("/participants", getParticipants);

router.get("/report-question", getReportedQuestion);

//FOR DEV ONLY
router.post("/upload-answer", uploadAnswer)
router.post("/create-user", registerController)

module.exports = router;
