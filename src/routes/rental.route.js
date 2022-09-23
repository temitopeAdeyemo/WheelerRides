const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth.middleware");
const {
  rentalDetail,
  pdfReciept,
} = require("../controllers/rental.controller");
router.use(express.static("src/public"));

router.use(authorization.authLogin);

router.get("/rental", (req, res) => {
  res.render("reserve2", {
    user: req.session.user,
    bookingUrl: req.originalUrl,
  });
});

router.post("/rental", rentalDetail);
router.get("/payment/reciept", pdfReciept);

module.exports = router;
