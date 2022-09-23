const express = require("express");
const user = require("../controllers/user.controller");
const authorization = require("../middlewares/auth.middleware");
const router = express.Router();

// creating routes to the endpoints
router.use(express.static("src/public"));
router.get("/sign-up", (req, res) => {
  res.render("sign-up", { user: req.user });
});
router.post("/sign-up", user.userRegistration);
router.post("/auth/login", user.userLogin);

router.get(
  "/search-user",
  authorization.authLogin,
  authorization.isAdmin,
  user.fetchUser
);

router.get(
  "/users",
  authorization.authLogin,
  authorization.isAdmin,
  user.allUsers
);

router.get(
  "/user",
  authorization.authLogin,
  authorization.isAdmin,
  user.findOneUser
);

router.post("/auth/user/verify", user.verifyEmail);
router.post("/auth/user/resend-verification-mail", user.resendVerificationMail);
router.post("/auth/user/password-reset-url", user.forgetPasswordLink);
router.patch("/auth/user/change-password", user.changePassword);
router.patch("/auth/user/reset-password", user.resetPassword);
router.get("/profile", authorization.authLogin, (req, res) => {
  res.render("profile", { user: req.session.user });
});
// exporting all routes
module.exports = router;
