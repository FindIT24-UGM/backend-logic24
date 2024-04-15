const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    password: {
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
    role: {
      type: String,
      default: "participantIC",
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
    return password === this.password;
  },
};

module.exports = mongoose.model("User", UserSchema);
