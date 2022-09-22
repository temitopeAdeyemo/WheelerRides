const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Using the mongoose schema method to create user schema
const commentSchema = new Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    commenterId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
// creating a model of the created schema
const commentModel = mongoose.model("Comment", commentSchema);
// exporting the created model
module.exports = commentModel;