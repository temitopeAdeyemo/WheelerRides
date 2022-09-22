const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv").config();
const express = require("express");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinaryUploadMethod = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, (err, res) => {
      if (err) {
        reject({
          err,
        });
      }
      resolve({
        res: res.secure_url,
      });
    });
  });
};
module.exports = cloudinaryUploadMethod;
