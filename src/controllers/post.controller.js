const Post = require("../models/blog_post.model");
const Comment = require("../models/comment.model");
const jwt = require("jsonwebtoken");
const cloudinaryUploadMethod = require("../utils/cloudinary");
const createPost = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    // validate inputs first
    let postOwnerId;
    if (!req.session.token && !req.user) {
      return res.status(500).json({
        message: "Please log in to post.",
      });
    }
    if (!req.session.token) {
      postOwnerId = req.user._id;
    } else {
      postOwnerId = await jwt.verify(req.session.token, process.env.JWT_TOKEN)
        .id;
    }

    const urls = [];
    const files = req.files;
    console.log("files", files);
    if (!files) {
      return res.status(400).json({ message: "No picture attached!" });
    }
    for (const file of files) {
      const { path } = file;
      try {
        const newPath = await cloudinaryUploadMethod(path);
        urls.push(newPath.res);
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: "error occur",
        });
      }
    }

    const newPost = new Post({ postOwnerId, title, body, image: urls });

    await newPost.save();
    console.log(newPost);
    return res.status(201).json({
      message: "Your Post has been uploaded",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

const findPost = async (req, res, next) => {
  try {
    const { post_id } = req.query;
    const post = await Post.findOne({ _id: post_id });
    console.log("done");
    if (!post) {
      return res.status.json({
        message: "Post Not Found or has been deleted...",
      });
    }

    req.session.post = post;
    console.log("req.session.all_posts", req.session.all_posts);
    let shuffledPosts = req.session.all_posts.sort(() => Math.random() - 0.5);
    if (shuffledPosts.length > 5) {
      shuffledPosts.length = 5;
    }

    const comments = await Comment.find({ postId: post_id }).populate(
      "commenterId",
      {
        firstName: 1,
        lastName: 1,
        _id: 0,
      }
    );
    console.log("comments", comments);
    // if (!comments) {
    //   return res.status.json({
    //     comment: "No comment yet, Be the first to comment...",
    //   });
    // }
    req.session.comments = comments;
    console.log(comments);

    res.render("blog-single", {
      user: req.session.user,
      post: req.session.post,
      posts: shuffledPosts,
      comments: req.session.comments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

const findPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    console.log("all-done");
    if (!posts) {
      return res.status.json({
        message: "No Post has been made yet...",
      });
    }
    console.log("all-done-here");
    req.session.all_posts = posts;
    console.log("all-done-here-too");
    console.log("posts", posts);
    res.render("blog", {
      user: req.session.user,
      posts: req.session.all_posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { post_id } = req.query;
    await Post.deleteOne({ _id: post_id });

    console.log("done");
    res.render("blog", {
      user: req.session.user,
      posts: req.session.all_posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
module.exports = { createPost, findPost, deletePost, findPosts };
