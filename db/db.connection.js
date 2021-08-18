const mongoose = require("mongoose");
require("dotenv").config();

const connectionUrl = process.env["CONNECTION_URL"];
const connectionConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

const initializeDbConnection = async () => {
  try {
    await mongoose.connect(connectionUrl, connectionConfig);
    console.log("Database connection successful!");
  } catch (error) {
    console.log("Could not connect to the database: ", error.message);
  }
};

module.exports = { initializeDbConnection };
