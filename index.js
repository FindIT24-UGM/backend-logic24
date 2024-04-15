const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const port = process.env.PORT || 5000;
const connectMongo = require("./api/config/mongo");
const app = express();

const authRouter = require("./api/routes/authRouter");
const examRouter = require("./api/routes/examRouter");
// const adminRouter = require("./api/routes/adminRouter");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API Logic Find IT! 2024");
});

app.use("/auth", authRouter);
app.use("/exam", examRouter);
// app.use("/admin", adminRouter);

app.use(morgan("dev"));

app.use(cors());

// Config
dotenv.config({ path: "./api/config/config.env" });

// Connect to MongoDB
connectMongo();

//SERVER RUN
app.listen(port, () => {
  console.log(
    `Server backend FIND-IT 2024 IT COMPETITION running on port http://localhost:${port}`
  );
});

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
