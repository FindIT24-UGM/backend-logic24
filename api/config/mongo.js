const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    await mongoose
      .set("strictQuery", false)
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
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
