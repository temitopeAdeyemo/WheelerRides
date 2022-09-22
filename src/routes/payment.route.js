const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth.middleware");
const {
  payment,
  paymentVerification,
} = require("../controllers/payment.controller");
router.use(express.static("src/public"));
router.post(
  "/payment/init",
  // authorization.authorization,
  payment
);
router.get("/payment/verify",
//  authorization.authorization,
  paymentVerification);

module.exports = router;
