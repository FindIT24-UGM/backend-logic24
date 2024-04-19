const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const port = process.env.PORT || 5001;  //KU GANTI 5001 BIAR GAK NABRAK BE MAIN WEB PAS NYOBA2
const connectMongo = require("./api/config/mongo");
const app = express();

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
app.listen(port, () => {
  console.log(
    `Server backend FIND-IT 2024 IT COMPETITION running on port http://localhost:${port}`
  );
});


