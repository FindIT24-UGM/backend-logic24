const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log(`MongoDB Connected!`);
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectMongo;
