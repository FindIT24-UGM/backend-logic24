const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  number: {
    type: Number,
  },
  questionChoice: {
    type: Array,
  },
  imageLink: {
    type: String,
  },
  report: {
    type: [String],
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
