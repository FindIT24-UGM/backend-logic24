const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const { fileURLToPath } = require("url");
const { dirname, join } = require("path");
const port = process.env.PORT || 5001; //KU GANTI 5001 BIAR GAK NABRAK BE MAIN WEB PAS NYOBA2
const connectMongo = require("./api/config/mongo");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const adminRouter = require("./api/routes/adminRouter");
const authRouter = require("./api/routes/authRouter");
const examRouter = require("./api/routes/examRouter");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan("dev"));

// app.use(cors());
// CORS
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  res.header("Access-Controll-Allow-Origin", "*");
  res.header(
    "Access-Controll-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

console.log(__dirname);
app.get("/socket/", (req, res) =>
  res.sendFile(join(__dirname, "/client/index.html"))
);

app.get("/", (req, res) => {
  res.send("API Logic Find IT! 2024");
});

app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/exam", examRouter);

// Config
dotenv.config({ path: "./api/config/config.env" });

// Connect to MongoDB
connectMongo();

//SERVER RUN
// app.listen(port, () => {
//   console.log(
//     `Server backend FIND-IT 2024 IT COMPETITION running on port http://localhost:${port}`
//   );
// });

const User = require("./api/models/UsersModel");
const authenticatedTeams = [];
const admins = [];

io.on("connection", (socket) => {
  console.log("a user connected, with socketId: " + socket.id);
  let teamName_g = null;
  let playerIndex_g = null;
  // ? Team Authentication
  socket.on("player-auth", async (authData) => {
    teamName_g = authData.teamName;
    playerIndex_g = authData.playerIndex;
    const teamName = authData.teamName;
    const playerIndex = authData.playerIndex;
    const playerName = authData.username;
    await User.updateMany(
      { teamName: teamName },
      { $set: { [`players.${playerIndex}.socketId`]: socket.id } }
    );
    const user = await User.findOne({ teamName: teamName });
    const localDate = new Date();
    if (!user?.startedTime) {
      const startedTime = localDate;
      await User.updateMany(
        {
          teamName: teamName,
        },
        {
          $set: {
            startedTime: startedTime
          },
        }
      );
    }
    if (!user?.endTime) {
      const endTime = localDate;
      if (localDate.getHours() < 14) {
        endTime.setHours(endTime.getHours() + 2);
      } else {
        endTime.setHours(16);
        endTime.setMinutes(0);
        endTime.setSeconds(0);
      }
      await User.updateMany(
        {
          teamName: teamName,
        },
        {
          $set: {
            endTime: endTime
          },
        }
      );
    }
    socket.join(teamName);
    socket
      .to(teamName)
      .emit("teammate-join", `Teammate ${playerName} bergabung`);
  });
  socket.on("disconnect", async () => {
    console.log("user disconnected");
    await User.updateMany(
      { teamName: teamName_g },
      { $set: { [`players.${playerIndex_g}.socketId`]: null } }
    );
    socket.broadcast.emit("admin-update");
  });
  socket.on("move", async (data) => {
    const playerName = data.playerName;
    const code = data.code;
    // await Teams.updateOne({ teamname: teamName_g }, { $set: { [`players.${playerIndex}.position`]: code } });
    socket.to(teamName_g).emit("teammate-move", { playerName, code });
  });
  socket.on("admin-broadcast", (msg) => {
    console.log("admin: " + msg);
    socket.broadcast.emit("message", msg);
  });
  socket.on("update", () => {
    socket.broadcast.emit("admin-update");
  });
  socket.on("team-update", () => {
    socket.to(teamName_g).emit("answer-update");
  });
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
