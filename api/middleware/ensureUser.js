const Status = require("../models/StatusModel.js");
const User = require("../models/UsersModel.js");

module.exports = {
  ensureOnceLogin: async function (req, res, next) {
    try {
      const user = await User.findOne({ username: req.body.username }).exec();
      if (user.isFinished === true) {
        return res.status(403).json({
          error: "No more attempt is allowed!",
          result: user,
        });
      } else {
        next();
      }
    } catch (err) {
      // Handle any errors that occur during the query execution
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },  

  ensureOpen: async function (req, res, next) {
    const status = await Status.findOne();
    if (!status.isOpen) {
      return res.status(400).json({
        error: "Sorry, but the exam is closed!",
      });
    } else {
      next();
    }
  },
};
