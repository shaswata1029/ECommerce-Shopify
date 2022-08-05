const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const connectDatabase = () => {
  mongoose.connect(MONGODB_URI).then((db) => {
    console.log("DB connected with server");
  });
};

module.exports = connectDatabase;
