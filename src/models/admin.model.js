const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Using the mongoose schema method to create admin schema
const AdminSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true 
    },
    age: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    phoneNumber: {
      type: String,
      minlength: 10,
      maxlength: 12,
    },
    role: {
      type: String,
      required: true,
      default: "ADMIN",
      enum: ["ADMIN"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// creating a model of the created schema
const AdminModel = mongoose.model("Admin", AdminSchema);
// exporting the created model
module.exports = AdminModel;