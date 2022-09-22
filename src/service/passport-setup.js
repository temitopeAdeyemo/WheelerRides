const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../utils/keys");
const OauthUser = require("../models/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config()
passport.serializeUser(async (user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  OauthUser.findById(id).then((user) => {
    done(null, user);
  });
});
passport.use(
  new googleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, email, done) => {
      const findUser = await OauthUser.findOne({ googleID: email.id });
      if (findUser) {
        console.log("User exists" + findUser);
        done(null, findUser);
      } else {
        const newUser = new OauthUser({
          firstName: email.name.givenName,
          lastName: email.name.familyName,
          googleID: email.id,
          email: email.emails[0].value,
          isVerified: true,
        });

        const data = {
          email: newUser.email,
          id: newUser._id,
          role: newUser.role,
        };
        const secret_key = process.env.JWT_TOKEN;
        const token = await jwt.sign(data, secret_key, { expiresIn: "2h" });
        await newUser.save();
        done(null, newUser);
      }
    }
  )
);
