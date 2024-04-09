const User = require("../models/UsersModel");
const QuestionSchema = require("../models/QuestionModel");
const EssaySchema = require("../models/EssayModel");
const { generateKeys } = require("../models/generateKeys");

exports.startExamControllers = async (req, res) => {
  const examUser = req.body.username;
  User.findOne({ username: examUser })
    .exec()
    .then((user) => {
      let questionNumber;
      if (
        user &&
        user.questionNumber.length > 1 &&
        user.essayNumber.length > 1
      ) {
        questionNumber = user.questionNumber;
        essayNumber = user.essayNumber;
        res.status(200).json({
          message: "Question successfully retrieved!",
          questionNumber: questionNumber,
          essayNumber: essayNumber,
        });
      } else {
        questionNumber = generateKeys(45);
        essayNumber = generateKeys(10);
        User.updateOne(
          { username: examUser },
          {
            $set: {
              questionNumber: user.questionNumber,
              essayNumber: user.essayNumber,
            },
          },
          { upsert: true }
        )
          .exec()
          .then(() => {
            res.status(200).json({
              message: "Question successfully retrieved!",
              questionNumber,
              essayNumber,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: "Error while updating user",
              err: err,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while fetching user!",
        err: err,
      });
    });
};

exports.getQuestion = (req, res) => {
  const examNumber = req.body.questionNumber;
  QuestionSchema.find({ number: { $in: examNumber } })
    .exec()
    .then((data) => {
      const sortedData = [];
      examNumber.forEach((number) => {
        const foundQuestion = data.find((item) => item.number === number);
        if (foundQuestion) {
          sortedData.push({
            number: foundQuestion.number,
            question: foundQuestion.question,
            questionChoice: foundQuestion.questionChoice,
            imageLink: foundQuestion.imageLink,
          });
        }
      });
      res.status(200).json({
        message: "Question has been found!",
        data: sortedData,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while fetching question!",
        err: err,
      });
    });
};

exports.saveUserAnswer = async (req, res) => {
  try {
    const username = req.body.username;
    const answerBody = req.body.answerBody;
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $set: { userAnswer: answerBody } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({
        message: "User is not found!",
      });
    }

    res.status(400).json({
      message: "Answer saved!",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error while saving answer!",
      err: err.message,
    });
  }
};

exports.getUserAnswer = async (req, res) => {
  const username = req.body.username;
  User.findOne({ username: username })
    .exec()
    .then((user) => {
      res.status(200).json({
        message: "Answer retrieved",
        data: user.userAnswer,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error while fetching user",
        error: error,
      });
    });
};

exports.getExamEndTime = async (req, res) => {};
