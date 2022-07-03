const mongoose = require("mongoose");
require("dotenv").config();

module.exports = () => {
  try {
    mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/billam",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to db");
  } catch (err) {
    console.log(err);
  }
};
