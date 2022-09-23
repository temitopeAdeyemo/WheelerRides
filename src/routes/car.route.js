const express = require("express");
const authorization = require("../middlewares/auth.middleware");
const car = require("../controllers/car.controller");
const router = express.Router();
router.use(express.static("src/public"));
const upload = require("../utils/multer");

router.post(
  "/car/post",
  upload.array("image", 4),
  car.addCar
);

router.get("/fetch-cars", car.fetchCars, (req, res, next) => {
  res.render("all-cars", {
    user: req.session.user,
    items: req.items,
    reroute: `/car?id=${req.items.id}`,
    itemCount: req.items.itemCount,
  });
});

router.get("/single-car", car.fetchCar, (req, res, next) => {
  let startElement =
    req.session.itemToShow[
      Math.floor(Math.random() * req.session.itemToShow.length)
    ];
  let startIndex = req.session.itemToShow.indexOf(startElement);
  if (
    startIndex == req.session.itemToShow.length - 1 ||
    startIndex == req.session.itemToShow.length - 2
  ) {
    startIndex = req.session.itemToShow.length - 3;
  }
  let endIndex = 3;
  res.render("car-single", {
    user: req.session.user,
    item: req.session.item,
    itemToShow: req.session.itemToShow.splice(startIndex, endIndex),
  });
});
router.patch(
  "/car",
  authorization.authorization,
  car.updateCarAvailability
);
// exporting all routes
module.exports = router;
