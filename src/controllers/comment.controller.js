const Comment = require("../models/comment.model");
const jwt = require("jsonwebtoken");
const createComment = async (req, res, next) => {
  try {
    const { body } = req.body;
    const { post_id } = req.params;
    // validate inputs first
    let commentOwnerId;
    if (!req.session.token && !req.user) {
      return res.status(500).json({
        message: "Please log in to post.",
      });
    } else {
      commentOwnerId = await jwt.verify(
        req.session.token,
        process.env.JWT_TOKEN
      ).id;
    }
    if (!req.session.token) {
      commentOwnerId = req.user._id;
    } else {
      commentOwnerId = await jwt.verify(
        req.session.token,
        process.env.JWT_TOKEN
      ).id;
    }
    const newComment = new Comment({
      commenterId: commentOwnerId,
      postId: post_id,
      body,
    });
    await newComment.save();
    console.log(newComment);
    return res.status(201).json({
      message: "Your Comment has been posted...",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const findComment = async (req, res, next) => {
  try {
    const { comment_id } = req.query;
    const comment = await Comment.findOne({ commentId: comment_id });
    console.log("done");
    if (!comment) {
      console.log("bad res");
    }
    console.log(comment);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

const findComments = async (req, res, next) => {
  try {
    const { post_id } = req.query;
    const comments = await Comment.find({ postId: post_id });
    console.log("done");
    if (!comments) {
      console.log("bad res");
    }
    console.log(comments);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.query;
    await Post.deleteOne({ commentId });
    console.log("done");
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

module.exports = { createComment, findComment, deleteComment, findComments };
