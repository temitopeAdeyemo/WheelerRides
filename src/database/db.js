const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
// An async function to call to connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATA_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database is connected`);
  } catch (error) {
    console.log(`Database Not Connected`);
  }
};
// exporting the connectBb function to use in other files
module.exports = connectDB;
