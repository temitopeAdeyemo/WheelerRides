const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth.middleware");
const {
  rentalDetail,
  pdfReciept,
} = require("../controllers/rental.controller");
router.use(express.static("src/public"));

const isLoggedIn = (req, res, next) => {
  if (!req.user && !req.session ) {
    console.log("req.user, req.session", req.user, req.session);
    return res.redirect("/login");
  }
  return next();
};
router.use(isLoggedIn);

router.get(
  "/rental",
  // authorization.authorization,

  (req, res) => {  
    // console.log(req.url)
    // console.log(req.originalUrl)
    res.render("reserve2", {
      user: req.session.user,
      bookingUrl: req.originalUrl,
    });
  }
);
router.post("/rental", 
// authorization.authorization,
 rentalDetail);
router.get("/payment/reciept", pdfReciept);

module.exports = router;
