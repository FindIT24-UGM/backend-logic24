const Status = require("../models/StatusModel.js");
const User = require("../models/UsersModel.js");

module.exports = {
  ensureOnceLogin: async function (req, res, next) {
    const user = await User.findOne({ username: req.body.username }).exec(
      (err, result) => {
        if (result.isFinished == true) {
          return res.status(403).json({
            error: "No more attempt is allowed!",
            result: result,
          });
        } else {
          next();
        }
      }
    );
    user();
  },

  ensureOpen: async function (req, res, next) {
    const status = Status.findOne();
    const role = req.body.role;
    const username = req.body.username;
    if (!status.isOpen && !username?.includes("mbaksk" || "b4ngIC")) {
      return res.status(400).json({
        error: "Sorry, but the exam is closed!",
      });
    } else {
      next();
    }
  },
};
