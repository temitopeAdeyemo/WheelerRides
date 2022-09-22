const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { validateReg, validateLogin } = require("../middlewares/joiValidation");
const { sendMail } = require("../utils/sendMail");
// creating a new user async function taking req, res and next as callbacks to create a user
exports.userRegistration = async (req, res, next) => {
  try {
    const { firstName, lastName, age, email, password, phoneNumber } = req.body;
    const validatedData = await validateReg.validateAsync(req.body);
    // authenticating and validating email to validate if user is registering with an existing email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        message: "  This email already exist, pls log in",
      });
    }
    // validating and hashing password
    if (password.length < 8) {
      return res.status(401).json({
        message: "Password too short.",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newDisakUser = new User({
      firstName,
      lastName,
      age,
      email,
      password: hashPassword,
      phoneNumber,
    });

    const data = {
      email: email,
      firstName: firstName,
    };
    // getting a secret token when login is successful
    const secret_key = process.env.JWT_TOKEN;
    const token = await jwt.sign(data, secret_key, { expiresIn: "900s" });
    let mailOptions = {
      to: email,
      subject: "Verify Email",
      text: `Hi ${firstName.toUpperCase()}, Pls verify your account with the link below.`,
    };
    await sendMail(mailOptions);
    await newDisakUser.save();
    return res.status(201).json({
      message: `Hi ${firstName.toUpperCase()}, Please check your email for verification.`,
      newDisakUser,
      redirectUrl: "/login",
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}`,
    });
  }
};

exports.allUsers = async (req, res, next) => {
  try {
    const fetchUsers = await User.find();
    return res.status(200).json({
      fetchUsers,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}, Please try again later.`,
    });
  }
};

//  Searching for a user from the database
exports.fetchUser = async (req, res, next) => {
  try {
    const { email } = req.query;
    const fetchOneUser = await User.findOne({ email });
    if (!fetchOneUser) {
      return res.status(201).json({
        message: `This id does not belong to an admin.`,
      });
    }
    return res.status(200).json({
      fetchOneUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}, Please try again later.`,
    });
  }
};
// user login
exports.userLogin = async (req, res, next) => {
  try {
    // destructuring email and password into the request body
    const { email, password } = req.body;
    const validatedData = await validateLogin.validateAsync(req.body);
    const emailExists = await User.findOne({ email });
    console.log(emailExists);
    // validating email before login
    if (emailExists == null || !emailExists.password) {
      return res.status(404).json({
        message: "Email does not exist, please sign up",
      });
    }
    // validating the password before login

    const correctPassword = await bcrypt.compare(
      password,
      emailExists.password
    );
    if (!correctPassword) {
      return res.status(401).json({
        message: "Login unsuccessful, incorrect login details.",
      });
    }
    // if (emailExists.isVerified === false) {
    //   return res.status(401).json({
    //     message: "User not verified",
    //   });
    // }

    // creating a payload
    const data = {
      id: emailExists._id,
      email: emailExists.email,
      role: emailExists.role,
    };
    emailExists.password = null;
    emailExists._id = null;
    // getting a secret token when login is successful
    const secret_key = process.env.JWT_TOKEN;
    const token = await jwt.sign(data, secret_key, { expiresIn: "2h" });
    console.log(req.session);
    req.session.token = token;
    req.session.user = { ...emailExists._doc };
    console.log(req.session);
    return res.status(200).json({
      message: `Hi ${emailExists.lastName.toUpperCase()} ${emailExists.firstName.toUpperCase()}, Welcome Back`,
      token,
      redirectUrl: "/",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error.message}, Try again later.`,
    });
  }
};

exports.findOneUser = async (req, res, next) => {
  try {
    const { _id } = req.query;
    const singleUser = await User.findOne({ _id });
    return res.status(201).json({
      singleUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}, Try again later.`,
    });
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const secret_key = process.env.JWT_TOKEN;
    const decodedToken = await jwt.verify(token, secret_key);
    const user = await User.findOne({ email: decodedToken.email }).select(
      "isVerified"
    );
    if (user.isVerified) {
      return res.status(400).json({
        message: "user verified already",
      });
    }
    user.isVerified = true;
    user.save();
    return res.status(201).json({
      message: `Hi ${decodedToken.firstName}, Your account has been verified, You can now proceed to login`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `${error.message}, Try again later.`,
    });
  }
};

exports.resendVerificationMail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const emailExists = await User.findOne({ email });
    if (!emailExists) {
      return res.status(400).json({
        message: "  This email does not exist, pls sign up.",
      });
    }
    const data = {
      email: emailExists.email,
      firstName: emailExists.firstName,
    };
    console.log(data);
    // getting a secret token when login is successful.
    const secret_key = process.env.JWT_TOKEN;
    const token = await jwt.sign(data, secret_key, { expiresIn: "900s" });
    let mailOptions = {
      to: emailExists.email,
      subject: "Verify Email",
      text: `Hi ${emailExists.firstName}, Pls verify your account with the link below.`,
    };
    await sendMail(mailOptions);
    return res.status(200).json({
      message: `Hi ${emailExists.firstName}, Pls check your mail for verification link.`,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}, Please try again later.`,
    });
  }
};

exports.forgetPasswordLink = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userEmail = await User.findOne({ email });
    if (!userEmail) {
      res.status(404).json({
        message: `Email not found.`,
      });
    }
    const data = {
      id: userEmail._id,
      email: userEmail.email,
      role: userEmail.role,
    };
    // getting a secret token
    const secret_key = process.env.JWT_TOKEN;
    const token = await jwt.sign(data, secret_key, { expiresIn: "900s" });
    let mailOptions = {
      to: userEmail.email,
      subject: "Reset Password",
      text: `Hi ${userEmail.firstName}, Reset your password with the link below. Your reset token is ${token}`,
    };
    await sendMail(mailOptions);
    return res.status(200).json({
      message: `Hi ${userEmail.firstName}, Pls check your email for the reset password link.`,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error.message}, Try again later.`,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email, token } = req.headers;
    const secret_key = process.env.JWT_TOKEN;
    const decoded_token = await jwt.verify(token, secret_key);
    if (decoded_token.email !== email) {
      return res.status(400).json({
        message: `Email do not match.`,
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: `Password do not match.`,
      });
    }
    const hashPassword = await bcrypt.hash(confirmPassword, 10);
    const updatedPassword = await User.updateOne(
      { email },
      { password: hashPassword },
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: `Password has been updated successfully.`,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}, Try agin later.`,
    });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { email } = req.query;

    const headerTokenEmail = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_TOKEN
    ).email;
    const loggedUser = await User.findOne({ email });
    if (!loggedUser) {
      return res.status(403).json({
        message: `Forbidden`,
      });
    }
    if (headerTokenEmail !== loggedUser.email) {
      return res.status(403).json({
        message: `Forbidden`,
      });
    }
    const passwordMatch = await bcrypt.compare(
      oldPassword,
      loggedUser.password
    );
    if (!passwordMatch) {
      return res.status(400).json({
        message: `Old Password is not correct`,
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: `Password do not match.`,
      });
    }
    const hashPassword = await bcrypt.hash(confirmPassword, 10);
    const resetPassword = await User.updateOne(
      { email },
      { password: hashPassword }
    );
    return res.status(200).json({
      message: `Password has been updated successfully.`,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}, Please Try agin later.`,
    });
  }
};
