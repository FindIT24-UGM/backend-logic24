const mongoose = require("mongoose");

const AnsweredPairsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  option: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  imageLink: {
    type: String,
  },
  number: {
    type: Number,
    required: true
  }
});

const AnswerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  answeredPairs: {
    type: [AnsweredPairsSchema], 
    required: true
  }
});

module.exports = mongoose.model("Answer", AnswerSchema);
