const express = require("express");
const {
  createPost,
  findPost,
  findPosts,
  deletePost,
} = require("../controllers/post.controller");
const upload = require("../utils/multer");
const router = express.Router();
router.use(express.static("src/public"));

router.post("/post/upload", upload.array("image", 4), createPost);
router.get("/all-posts", findPosts);
router.get("/single-post", findPost);
router.delete("/remove-post", deletePost);

// exporting all routes
module.exports = router;
