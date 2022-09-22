const jwt = require("jsonwebtoken");
require("dotenv").config();
// authrisation middleware to ensure users and admin have token to hit an endpoint
exports.authorization = async (req, res, next) => {
  try {
    const authorizationArr = await req.headers.authorization.split(" ");
    // validation to ensure a user or admin have token before hitting an endpoint
    if (!authorizationArr.includes("Bearer")) {
      return res.status(404).json({
        message: "Bearer must be included",
      });
    }
    const token = authorizationArr[1];
    // validation to ensure a user or admin has token before hitting an endpoint
    if (token === null) {
      return res.status(401).json({
        message: "Token is required...",
      });
    }
    // decrypting the user or admin token to access the encrypted data
    const decryptToken = await jwt.verify(token, process.env.JWT_TOKEN, {
      expiresIn: "1h",
    });
    console.log(decryptToken);
    req.user = decryptToken;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// middleware to verify the role as admin before accessing an endpoint
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(405).json({
        message: "Unauthorised Request.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.authLogin = async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.redirect("/login");
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
