const express = require("express");
const router = express.Router();
const passport = require("passport");

router.use(express.static("src/public"));
router.get("/loginn", (req, res) => {
  res.render("login", { user: req.user });
});

router.get("/about", (req, res) => {
  res.render("about", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session.user = null;
  req.session.token = null;
  res.redirect("/login");
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/");
});

module.exports = router;
