const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Using the mongoose schema method to create user schema
const postSchema = new Schema(
  {
    postOwnerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: [{
      type: String,
    }],
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// creating a model of the created schema
const postModel = mongoose.model("Post", postSchema);
// exporting the created model
module.exports = postModel;
