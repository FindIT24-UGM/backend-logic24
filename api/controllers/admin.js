const QuestionModel = require("../models/QuestionModel");
const User = require("../models/UsersModel");
const Answer = require("../models/AnswerModel");

exports.ensureAdmin = async (req, res, next) => {
  if (req.body.role !== "mbaksk" || "b4ngIC") {
    return res.status(400).json({
      error: "Admin Resources, need permission!",
    });
  }
  next();
};

exports.getTeamsScore = async (req, res) => {
  const teamName = req.body.teamName;
  try {
    const targetAnswer = await Answer.findOne({ name: "AnswerMultiple" });
    let questionValue = [];
    let answerValue = [];

    const examUser = await User.findOne({ teamName: teamName });
    let questionTeam = [];
    let answerTeam = [];

    targetAnswer.answeredPairs.forEach((answer) => {
      questionValue.push(answer.question);
      answerValue.push(answer.answer);
    });

    examUser.userAnswer.forEach((userAnswer) => {
      if(userAnswer.type === "question"){
        questionTeam.push(userAnswer.quest);
        answerTeam.push(userAnswer.answer);
      }
    });
    // for (const [key, value] of Object.entries(targetAnswer.answeredPairs)) {
    //   questionValue.push(key);
    //   answerValue.push(value);
    // }

    // for (const [key, value] of Object.entries(targetUser.userAnswer)) {
    //   questionTeam.push(key);
    //   answerTeam.push(value);
    // }
    // console.log(examUser.userAnswer);
    if (examUser) {
      let score = 0;
      let benar = 0;
      let salah = 0;
      //LOGIC SCORING DAH FIX, KLO MAU GANTI JGN GANTI DI SINI 
      for (let i = 0; i <= questionTeam.length; i++) {
        let question = questionTeam[i];
        let answer = answerTeam[i];
        // let questionIndex = questionValue.indexOf(question);
        for (let j = 0; j <= questionValue.length; j++) {
          let questionKey = questionValue[j];
          let answerKey = answerValue[j];
          
          if (question == questionKey && answer == answerKey) {
              console.log(answer);
              score += 4; 
              benar += 1;
            }
            if (question == questionKey && answer != answerKey) {
              score += -1;
              salah += 1;
            }
        }
        // if (questionIndex !== -1) {
        //   let answerValueAtIndex = answerValue[questionIndex];

        //   if ((answer = answerValueAtIndex)) {
        //     score += 4;
        //     benar += 1;
        //   } else if ((answer = answerValueAtIndex)) {
        //     score -= 1;
        //     salah += 1;
        //   }
        // }
      }
      res.status(200).json({
        message: "Team answer successfully fetched!",
        teamName: examUser.teamName,
        score: score,
        benar,
        salah,
        // answer: answerValue,
        // kunci: targetAnswer.answeredPairs,
        // user: examUser.userAnswer
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

exports.getTeamsEssayAnswer = async (req, res) => {
  const teamName = req.body.teamName;
  try {
    // const targetAnswer = await Answer.findOne({ name: "AnswerMultiple" });
    // let questionValue = [];
    // let answerValue = [];

    const examUser = await User.findOne({ teamName: teamName });
    let questionTeam = [];
    let answerTeam = [];

    // targetAnswer.answeredPairs.forEach((answer) => {
    //   questionValue.push(answer.essay);
    //   answerValue.push(answer.answer);
    // });

    examUser.userAnswer.forEach((userAnswer) => {
      if(userAnswer.type === "essay"){
      questionTeam.push(userAnswer.essay);
      answerTeam.push(userAnswer.answer);
      }
    });

    return res.status(200).json({
      message: "Team answer successfully fetched!",
      teamName: examUser.teamName,
      essayanswer: examUser.userAnswer,
    });
    
  } catch (error) {
    return res.status(400).json({
      message: "Failed to get essay answer",
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
  User.aggregate([
    {
      $match: {
        teamName: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$teamName",
        user: { $first: "$$ROOT" }, // Mengambil satu dokumen dari setiap grup
      },
    },
    {
      $replaceRoot: { newRoot: "$user" }, // Mengganti root dokumen dengan dokumen dari setiap grup
    },
  ])
    .exec()
    .then(async (user) => {
      const finished = await countTotalIsFinished();
      const isNotDoing = await countTotalStatus("NO");
      const isDoing = await countTotalStatus("DOING");
      res.status(200).json({
        // user: [...new Set(user.map(u => u.teamName))],
        user,
        finished,
        isNotDoing,
        isDoing,
      });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.getReportedQuestion = (req, res) => {
  QuestionModel.find({
    report: { $not: { $size: 0 } },
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        info: "Reported Question",
        reportedQuestion: result,
      });
    })
    .catch((err) => {
      res.status(404).json({
        error: "cannot get reported question",
        err,
      });
    });
};

exports.uploadAnswer = (req, res) => {
  const { answeredPairs } = req.body;
  const newAnswer = new Answer({
    name: "AnswerMultiple",
    answeredPairs,
  });
  newAnswer
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.registerController = (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({
    username,
    password,
  });
  newUser
    .save()
    .then((result) => {
      res.status(201).json({
        message: "success create new user",
        result,
      });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.getEndTime = (req, res) => {
  const { teamName } = req.body;
  User.findOne({ teamName })
    .exec()
    .then(async (user) => {
      if (!user) {
        return res.status(400).json({
          errors: "Team with that teamName does not exist",
        });
      }
      return res.json({
        team: user.teamName,
        endTime: user.endTime,
      });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

const countTotalIsFinished = async () => {
  // return await User.countDocuments({ isFinished: true });
  // const users = await User.find({ isFinished: true }).select('teamName');
  // const uniqueTeamNames = new Set(users.map(user => user.teamName));
  // return uniqueTeamNames.size;
  const isFinished = await User.aggregate([
    {
      $match: {
        teamName: { $exists: true, $ne: null },
        isFinished: true,
      },
    },
    {
      $group: {
        _id: "$teamName",
        user: { $first: "$$ROOT" }, // Mengambil satu dokumen dari setiap grup
      },
    },
    {
      $replaceRoot: { newRoot: "$user" }, // Mengganti root dokumen dengan dokumen dari setiap grup
    },
  ]);

  return isFinished.length;
};

const countTotalStatus = async (status) => {
  // return await User.countDocuments({ status });
  // const users = await User.find({ status }).select('teamName');
  // const uniqueTeamNames = new Set(users.map(user => user.teamName));
  // return uniqueTeamNames.size;
  const total = await User.aggregate([
    {
      $match: {
        teamName: { $exists: true, $ne: null },
        status: status,
      },
    },
    {
      $group: {
        _id: "$teamName",
        user: { $first: "$$ROOT" }, // Mengambil satu dokumen dari setiap grup
      },
    },
    {
      $replaceRoot: { newRoot: "$user" }, // Mengganti root dokumen dengan dokumen dari setiap grup
    },
  ]);

  return total.length;
};

exports.unfinished = async (req, res) => {
  try {
    await User.updateMany({}, { $set: { isFinished: false } });
    return res.json({ message: "Perubahan berhasil!" });
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan saat memperbarui data." });
  }
};