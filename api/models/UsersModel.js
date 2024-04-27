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
    playerIndex: {
      type: String
    },
    players: [
      {
        socketId: {
          type: String
        },
        playerName: {
          tyep: String
        },
        position: {
          type: String
        }
      }
    ],
    startedTime: {
      type: String
    },
    endTime: {
      type: String
    },
    status: {
      type: String,
      default: "NO"  //klo blm ngerjain : 'NO', sedang ngerjain: 'DOING', selesai: 'DONE' + set isFinished: true
    }
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
