const { validationResult } = require("express-validator");
const User = require("../models/usersModel.js");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signInRequired = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: function fromHeaderOrCookie(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  },
});

exports.loginController = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.userPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  }

  const user = await User.findOne({ username: username });

  if (!userName || !password) {
    return res.status(400).json({
      error: "username and password is required!",
    });
  }

  if (!user) {
    return res.status(400).json({
      error: "user is not found!",
    });
  }

  if (!user.authenticate(password)) {
    return res.status(400).json({
      error: "Email and Password does not match!",
    });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  res.cookie("cookiesLogic", token, { expiresIn: "3h" });

  const currentUser = user.username;
  const currentId = user._id;
  const answers = user.userAnswer;
  const teamName = user.teamName;
  const isFinished = user.isFinished;

  // const {}

  return res.json({
    message: "Sign in successfully",
    token,
    currentUser,
    currentId,
    userAnswer,
    teamName,
    isFinished,
    role: user.role,
  });
};

exports.finishedExam = (req, res) => {
  User.findOneAndUpdate(
    { username: req.body.username },
    { $set: { isFinished: true } }
  )
    .exec()
    .then(() => {
      res.status(200).json({
        message: "User finished exam!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error while updating user",
        error: error,
      });
    });
};
