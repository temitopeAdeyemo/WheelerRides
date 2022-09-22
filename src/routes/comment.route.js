const express = require("express");

const {
  createComment,
  findComments,
  // deletePost,
} = require("../controllers/comment.controller");

const router = express.Router();

router.post("/post/:post_id/comment", createComment);
router.get("/comment/get", findComments);
// router.delete("/comment/remove", deletePost);

// exporting all routes
module.exports = router;
