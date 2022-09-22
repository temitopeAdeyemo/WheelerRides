const express = require("express");
const admin = require("../controllers/admin.controller");
const router = express.Router();
const authorization = require("../middlewares/auth.middleware");
// creating routes to the endpoints
router.use(express.static("src/public"));
router.post( "/admin", admin.adminRegistration );
router.post( "/auth/login/admin", admin.adminLogin );

router.post("/auth/admin/verify", admin.verifyEmail);
router.post("/auth/admin/password-reset-url", admin.forgetPasswordLink);
router.patch("/auth/admin/reset-password", admin.resetPassword);
router.patch(
  "/auth/admin/change-password",
  authorization.authorization,
  authorization.isAdmin,
  admin.changePassword
);
router.post("/auth/admin/resend-verification-mail", admin.resendVerificationMail);
router.get(
  "/admin",
  authorization.authorization,
  authorization.isAdmin,
  admin.findOneAdmin
);
router.get(
  "/admins",
  authorization.authorization,
  authorization.isAdmin,
  admin.allAdmins
);
// exporting all routes
module.exports = router;