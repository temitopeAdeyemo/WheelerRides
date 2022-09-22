const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Using the mongoose schema method to create user schema
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    lowercase: true
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true
  },
  age: {
    type: Number,
  },
  phoneNumber: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["User"],
    default: "User",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  googleID: {
    type: String
  }
},
{
    timestamps: true
});
// creating a model of the created schema
const userModel = mongoose.model("User", userSchema);
// exporting the created model
module.exports = userModel;
