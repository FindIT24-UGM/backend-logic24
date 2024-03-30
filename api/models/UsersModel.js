const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
    isFinished: {
      type: Boolean,
    },
    questionNumber: {
      type: Array,
    },
    essayNumber: {
      type: Array,
    },
    userAnswer: {
      type: Object,
    },
    answers: {
      type: Object,
    },
    teamName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods = {
  authenticate: function (password) {
    return password === this.userPassword;
  },
};

module.exports = mongoose.model("User", UserSchema);
