const express = require("express");
const router = express.Router();

const { signInRequired, finishedExam } = require("../controllers/auth");
const {
  startExamControllers,
  getQuestions,
  saveUserAnswer,
  getEssay,
  getUserAnswer,
  reportQuestion,
} = require("../controllers/exam");
// const {
//   ensureOpen,
//   ensureOnceLogin,
// } = require("../config/middleware/ensureUser");

// PATCH API for user to start exam
// BODY: username
// RETURN: questionNumber to frontend and to database
router.patch(
  "/start",
  // ensureOnceLogin,
  // ensureOpen,
  signInRequired,
  startExamControllers
);

// POST API for user to get question
// BODY: questionNumber
// RETURN: question
router.post("/question", /* ensureOpen ,*/ signInRequired, getQuestions);

// POST API for user to get essay
// BODY: essayNumber
// RETURN: essay
router.post("/essay", /* ensureOpen ,*/ /* signInRequired, */ getEssay);

// PATCH API for user to report question
// BODY : questionNumber, report
// RETURN : message
router.patch("/question", /** ensureOpen ,signInRequired**/ reportQuestion);

// POST API for user to save answer
// BODY: username, answerBody
// RETURN: updated user
router.post(
  "/answer",
  // ensureOnceLogin,
  // ensureOpen,
  signInRequired,
  saveUserAnswer
);

// PATCH API for user to finish exam
// BODY: username
// RETURN: updated user
router.patch("/finish", /* ensureOpen ,*/ signInRequired, finishedExam);

// GET API for user to get result
// BODY: username
// RETURN: result
router.patch("/result", /* ensureOpen ,*/ signInRequired, getUserAnswer);

module.exports = router;
