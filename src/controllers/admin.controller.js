const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const {
  validateReg,
  validateLogin,
} = require("../middlewares/joiValidation");
const { sendMail } = require("../utils/sendMail");
// creating a new admin async function taking req, res and next as callbacks to create a admin
exports.adminRegistration = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      age,
      email,
      password,
      phoneNumber,
      role,
    } = req.body;
    //Using Joi to authenticate users
    const validatedData = await validateReg.validateAsync(req.body);

    // authenticating and validating email to validate if admin is registering with an existing email
    const emailExists = await Admin.findOne({
      email: validatedData.email,
    });
    if (emailExists) {
      return res.status(409).json({
        message: "This email already exist, Please log in",
      });
    }
    // // validating and hashing password
    if (password.length < 8) {
      return res.status(403).json({
        message: "Password too short.",
      });
    }
    if (
      validatedData.password.includes(firstName) ||
      validatedData.password.includes(lastName)
    ) {
      return res.status(403).json({
        message: "Password too Weak",
      });
    }
    const hashPassword = await bcrypt.hash(validatedData.password, 10);
    const newDisakAdmin = new Admin({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      age: validatedData.age,
      email: validatedData.email,
      password: hashPassword,
      phoneNumber: validatedData.phoneNumber,
      role,
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
    await newDisakAdmin.save();
    return res.status(201).json({
      message: `Hi ${firstName.toUpperCase()}, Your account has been created successfully. Please check your email for verification.`,
      newDisakAdmin,
      token
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}, Try again  later.`,
    });
  }
};
// login in an admin
exports.adminLogin = async (req, res, next) => {
  try {
    const validatedLoginData = await validateLogin.validateAsync(req.body);
    const emailExists = await Admin.findOne({
      email: validatedLoginData.email,
    });
    console.log(validatedLoginData.email);
    // validating email before login
    if (emailExists == null) {
      return res.status(404).json({
        message:
          "Email does not exist, please sign up as a user if you are not an admin",
      });
    }
    // validating the password before login
    const correctPassword = await bcrypt.compare(
      validatedLoginData.password,
      emailExists.password
    );
    if (!correctPassword) {
      return res.status(401).json({
        message: "Login unsuccessful, Please verify your login details.",
      });
    }
    if (emailExists.isVerified === false) {
      return res.status(401).json({
        message: "User not verified",
      });
    }
    // creating a payload
    const data = {
      id: emailExists._id,
      email: emailExists.email,
      role: emailExists.role,
    };
    // getting a secret token when login is successful
    const secret_key = process.env.JWT_TOKEN;
    const token = await jwt.sign(data, secret_key, { expiresIn: "1h" });
    return res.status(200).json({
      message: `Hi ${emailExists.lastName.toUpperCase()} ${emailExists.firstName.toUpperCase()}, Welcome Back`,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error.message}, Try again later.`,
    });
  }
};


exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    // verifying the token on the query params to make access the id and find the user to be verified
    const secret_key = process.env.JWT_TOKEN;
    const decodedToken = await jwt.verify(token, secret_key);
    const admin = await Admin.findOne({ email: decodedToken.email }).select(
      "isVerified"
    );
    if (admin.isVerified) {
      return successResMsg(res, 200, {
        message: "Admin verified already",
      });
    }
//Assigning isVerified to true 
    admin.isVerified = true;
    admin.save();
    return res.status(201).json({
      message: `Hi ${decodedToken.firstName}, Your account has been verified, You can now proceed to login`,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}, Try again later.`,
    });
  }
};

exports.findOneAdmin = async (req, res, next) => {
  try {
    const { _id } = req.headers;
    const singleAdmin = await Admin.findOne({ _id });
    if (!singleAdmin){
      return res.status(201).json({
        message: `This id does not belong to an admin.`,
      });      
    }
      return res.status(201).json({
        singleAdmin,
      });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}, Try again later.`,
    });
  }
};

exports.allAdmins = async (req, res, next) => {
  try {
    const fetchAdmins = await Admin.find();
    return res.status(200).json({
      fetchAdmins,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}, Please try again later.`,
    });
  }
};

exports.resendVerificationMail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const emailExists = await Admin.findOne({ email });
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
    // getting a secret token when login is successful
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
    const adminEmail = await Admin.findOne({ email });
    // Making sure the email in the request body is found in the request body
    if (!adminEmail) {
      res.status(404).json({
        message: `Email not found.`,
      });
    }
    const data = {
      id: adminEmail._id,
      email: adminEmail.email,
      role: adminEmail.role,
    };
    // getting a secret token
    const secret_key = process.env.JWT_TOKEN;
    const token = await jwt.sign(data, secret_key, { expiresIn: "900s" });
    let mailOptions = {
      to: adminEmail.email,
      subject: "Reset Password",
      text: `Hi ${adminEmail.firstName}, Reset your password with the link below. Your reset token is ${token}`,
    };
    await sendMail(mailOptions);
    return res.status(200).json({
      message: `Hi ${adminEmail.firstName}, Pls check your email for the reset password link.`,
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
    const { email, token } = req.query;
    // Decoding the token in the authorisation headers
    const secret_key = process.env.JWT_TOKEN;
    const decoded_token = await jwt.verify(token, secret_key);
    // Comparing the query token email and the query email before giving access to reset password
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
    // Hashing the new password before updating and saving
    const hashPassword = await bcrypt.hash(confirmPassword, 10);
    const updatedPassword = await Admin.updateOne(
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
    //Decoding authorisation header token and Comparing the token email with the query email before giving access to reset password
    const loggedAdmin = await Admin.findOne({ email });
    const headerTokenEmail = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_TOKEN
    ).email;
    if (headerTokenEmail !== loggedAdmin.email) {
      return res.status(403).json({
        message: `Forbidden`,
      });
    }
    const passwordMatch = await bcrypt.compare(
      oldPassword,
      loggedAdmin.password
    );
    console.log(passwordMatch);
    if (!passwordMatch) {
      return res.status(400).json({
        message: `Old Password is not correcgt`,
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: `Password do not match.`,
      });
    }
    // Hashing the new password before updating and saving
    const hashPassword = await bcrypt.hash(confirmPassword, 10);
    const resetPassword = await Admin.updateOne(
      { email },
      { password: hashPassword }
    );
    return res.status(200).json({
      message: `Password has been updated successfully.`,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: `${error.message}, Please Try agin later.`,
    });
  }
};
