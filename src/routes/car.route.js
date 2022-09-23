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

router.get("/fetch-cars", car.fetchCars);

router.get("/single-car", car.fetchCar);

router.patch("/car", authorization.authLogin, car.updateCarAvailability);
// exporting all routes
module.exports = router;
