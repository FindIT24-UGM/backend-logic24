const QuestionModel = require("../models/QuestionModel");
const User = require("../models/UsersModel");

exports.ensureAdmin = async (req, res, next) => {
  if (req.body.role !== "mbaksk" || "b4ngIC") {
    return res.status(400).json({
      error: "Admin Resources, need permission!",
    });
  }
  next();
};

exports.getTeamsScore = async (req, res) => {
  const username = req.body.username;
  const teamname = req.body.teamname;
  User.findOneAndUpdate(
    { username: username },
    { $set: { teamname: teamname } }
  );
  try {
    const targetAnswer = await Answer.findOne({ name: "AnswerPairs" });
    const questionValue = [];
    const answerValue = [];

    const examUser = await User.findOne({ teamname: teamname });
    const questionTeam = [];
    const answerTeam = [];

    for (const [key, value] of Object.entries(targetAnswer.answeredPairs)) {
      questionValue.push(key);
      answerValue.push(value);
    }

    for (const [key, value] of Object.entries(targetUser.userAnswer)) {
      questionTeam.push(key);
      answerTeam.push(value);
    }

    if (examUser) {
      let score = 0;

      for (let i = 0; i < questionTeam.length; i++) {
        const question = questionTeam[i];
        const answer = answerTeam[i];
        const questionIndex = questionValue.indexOf(question);

        if (questionIndex !== -1) {
          const answerValueAtIndex = answerValue[questionIndex];

          if ((answer = answerValueAtIndex)) {
            score += 4;
          } else if ((answer = answerValueAtIndex)) {
            score -= 1;
          }
        }
      }
      res.status(200).json({
        message: "Team answer successfully fetched!",
        teamname: examUser.teamname,
        score: score,
      });
    } else {
      res.status(404).json({
        message: "User is not found!",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Failed to get the team score!",
      err: err.message,
    });
  }
};

exports.getTeamsAnswer = async (req, res) => {
  try {
    const teams = await User.find();
    const teamsAnswer = teams.map((team) => {
      return {
        username: team.username,
        answered:
          typeof team.userAnswer == "object"
            ? Object.keys(team.userAnswer).length
            : 0,
      };
    });
    res.status(200).json({
      message: "Teams retrieved successfully!",
      data: teamsAnswer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error while fetching team answer",
      err: err.message,
    });
  }
};

exports.getParticipants = (req, res) => {
  User.find().exec()
  .then(async(user) => {
    const finished = await countTotalIsFinished()
    const isNotDoing = await countTotalStatus("NO")
    const isDoing = await countTotalStatus("DOING")
    res.status(200).json({
      user,
      finished,
      isNotDoing,
      isDoing
    })
  })
  .catch(err =>{
    res.status(404).json(err)
  })
}

exports.getReportedQuestion = (req, res) => {
  QuestionModel.find({
    report: { $not: { $size: 0 } }
  })
  .exec()
  .then(result => {
    res.status(200).json({
      info: "Reported Question",
      reportedQuestion: result
    })
  })
  .catch(err => {
    res.status(404).json({
      error: "cannot get reported question", 
      err
    })
  })
}

const countTotalIsFinished = async () => {
  return await User.countDocuments({ isFinished: true });
};

const countTotalStatus = async (status) => {
  return await User.countDocuments({ status });
};