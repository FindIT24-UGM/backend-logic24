const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Status", StatusSchema);
