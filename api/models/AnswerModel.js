const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  answeredPairs: {
    type: Object,
  },
});

module.exports = mongoose.model("Answer", AnswerSchema);
