const mongoose = require("mongoose");

const EssaySchema = new mongoose.Schema({
  essay: {
    type: String,
  },
  essayNumber: {
    type: Number,
  },
  imageLink: {
    type: String,
  },
});

module.exports = mongoose.model("Essay", EssaySchema);
