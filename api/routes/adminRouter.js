const express = require("express");
const router = express.Router();

const {
  getTeamsScore,
  getTeamsAnswer,
  getReportedQuestion,
  getParticipants,
  uploadAnswer,
  registerController,
  getTeamsEssayAnswer,
  getEndTime,
  unfinished,
  resetEndTime
} = require("../controllers/admin");

// GET API for admin to get score
// BODY: username, teamname
// RETURN: teamname, score
router.post("/score", getTeamsScore);

router.post("/essayanswer", getTeamsEssayAnswer);

// GET API for admin to get answers of all users
// BODY: -
// RETURN: username, answer
router.get("/answer", getTeamsAnswer);

router.get("/participants", getParticipants);

router.get("/report-question", getReportedQuestion);

router.post("/endtime", getEndTime);

//FOR DEV ONLY
router.post("/upload-answer", uploadAnswer);
router.post("/create-user", registerController);
router.post("/unfinished", unfinished);
router.post("/resetEndTime", resetEndTime);


module.exports = router;
