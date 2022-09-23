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
  payment
);
router.get("/payment/verify",
  paymentVerification);

module.exports = router;
