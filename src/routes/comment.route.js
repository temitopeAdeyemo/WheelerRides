const express = require("express");
const {
  createComment,
  findComments,
} = require("../controllers/comment.controller");
const router = express.Router();

router.post("/post/:post_id/comment", createComment);

router.get("/comment/get", findComments);

// exporting all routes
module.exports = router;
