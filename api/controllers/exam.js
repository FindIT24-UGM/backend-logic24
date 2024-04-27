const User = require("../models/UsersModel");
const QuestionSchema = require("../models/QuestionModel");
const EssaySchema = require("../models/EssayModel");
const { generateKeys } = require("../helpers/generateKeys");
const QuestionModel = require("../models/QuestionModel");

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
        questionNumber = generateKeys(5);
        essayNumber = generateKeys(5);
        User.updateOne(
          { username: examUser },
          {
            $set: {
              questionNumber: questionNumber,
              essayNumber: essayNumber,
              startedTime: Date.now()
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

exports.getQuestions = (req, res) => {
  const questionNumber = req.body.questionNumber;
  QuestionSchema.find({ number: { $in: questionNumber } })
    .exec()
    .then((data) => {
      const sortedData = [];
      questionNumber.forEach((number) => {
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
        message: "Questions has been found!",
        data: sortedData,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while fetching questions!",
        err: err,
      });
    });
};

exports.getEssay = (req, res) => {
  const essayNumber = req.body.essayNumber;
  EssaySchema.find({ essayNumber: { $in: essayNumber } })
    .exec()
    .then((data) => {
      const sortedData = [];
      essayNumber.forEach((number) => {
        const foundQuestion = data.find((item) => item.essayNumber === number);
        if (foundQuestion) {
          sortedData.push({
            essayNumber: foundQuestion.essayNumber,
            essay: foundQuestion.essay,
            imageLink: foundQuestion.imageLink,
          });
        }
      });
      res.status(200).json({
        message: "Essays found",
        data: sortedData,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error while find essays",
        error: error,
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

    res.status(200).json({
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

exports.getExamEndTime = async (req, res) => {
  try {
    const username = req.body.username;

    // kita perlu attribute userStartExamTime, aku sembarang dulu ya
    const user = await User.findOne({ username: username });

    // sembarang userStartExamTime
    const startTime = new Date();

    // berapa lama batas waktu pengerjaan, contohnya 1 jam 30 menit
    const hourDuration = 1;
    const minuteDuration = 30;

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + hourDuration);
    endTime.setMinutes(startTime.getMinutes() + minuteDuration);

    res.status(200).json({
      message: "Exam end time retrieved",
      data: endTime,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching exam end time",
      error: err,
    });
  }
};

exports.reportQuestion = async (req, res) => {
  try {
    const questionNumber = req.body.questionNumber;
    const reportMessage = req.body.reportMessage;
    const question = await QuestionModel.findOne({ number: questionNumber });
    if (!question) {
      return res.status(400).json({
        message: `Question number ${questionNumber} is not found!`,
      });
    }
    question.report = [reportMessage, ...question.report];
    await question.save();
    return res
      .status(200)
      .json({ message: `Question ${questionNumber} has been reported!` });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching exam end time",
      error: err,
    });
  }
};
