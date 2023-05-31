const path = require("path");
const cloudinaryUploadMethod = require("../utils/cloudinary");
const mongoose = require("mongoose");
const { validateCarDetails } = require("../middlewares/joiValidation.Car");
const pool = require("../database/sql_db");
//  Posting cars to the database.
exports.addCar = async (req, res, next) => {
  try {
    const {
      brand,
      year,
      manufacturer,
      rentPerHour,
      transmission,
      fuelType,
      features,
      seat,
      description,
    } = req.body;
    // Using Joi to authenticate users details
    const validatedData = await validateCarDetails.validateAsync(req.body);
    //pushing cloudinary uri of each picture to urls array
    const urls = [];
    const files = req.files;
    console.log(files);
    if (!files) {
      return res.status(400).json({ message: "No picture attached!" });
    }
    for (const file of files) {
      const { path } = file;
      try {
        const newPath = await cloudinaryUploadMethod(path);
        urls.push(newPath.res);
      } catch (error) {
        return res.status(500).json({
          message: "error occur",
        });
      }
    }
    const newCar = await pool.query(
      "INSERT INTO Car (manufacturer,brand,rentPerHour,description,features,image,year,transmission,fuelType,seat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        manufacturer,
        brand,
        rentPerHour,
        description,
        features,
        urls,
        year,
        transmission,
        fuelType,
        seat,
      ]
    );
    return res.status(201).json({
      message: `A ${newCar.rows[0].manufacturer} ${newCar.rows[0].brand}, ${newCar.rows[0].year} model has been added.`,
      data: newCar.rows[0],
      // redirectUrl: "/post-car",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `${error.message}, Please try again later.`,
    });
  }
};
//  Getting cars from the database
exports.fetchCars = async (req, res, next) => {
  try {
    const { page } = req.query;

    // Getting all cars to get the car count
    const allCars = await pool.query("SELECT * FROM Car");
    // Getting all cars by pagination
    const allPaginatedCars = await pool.query(
      `SELECT * FROM Car Order By id LIMIT 12 OFFSET (${
        ((page || 1) - 1) * 12
      })`
    );
    // Setting the page not found condition
    if (
      allPaginatedCars.rows[0] == null ||
      !allPaginatedCars.rows[0] ||
      allPaginatedCars.rows[0] == []
    ) {
      return res.render("all-cars", {
        items: [],
        user: req.session.user,
      });
    }
    dataCount = allCars.rows.length;
    // console.log(dataCount)
    req.items = allPaginatedCars.rows;
    req.items.itemCount = dataCount;
    res.render("all-cars", {
      user: req.session.user,
      items: req.items,
      reroute: `/car?id=${req.items.id}`,
      itemCount: req.items.itemCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `${error.message}, Please try again later.`,
    });
  }
};

exports.fetchCar = async (req, res, next) => {
  try {
    const { id } = req.query;

    // Getting all cars to get the car count
    const allCars = await pool.query("SELECT * FROM Car WHERE id = $1", [id]);
    // Setting the page not found condition
    if (allCars.rows[0] == null || !allCars.rows[0] || allCars.rows[0] == []) {
      return res.render("all-cars", {
        item: [],
        user: req.session.user,
      });
    }
    req.session.item = allCars.rows[0];
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
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: `${error.message}, Please try again later.`,
    });
  }
};
//  Setting Car availaability to true.
exports.updateCarAvailability = async (req, res, next) => {
  try {
    const { car_id } = req.headers;

    const findCar = await pool.query("SELECT * FROM Car WHERE id = $1", [
      car_id,
    ]);
    // Condition making sure unlisted cars dont get modified
    if (!findCar.rows[0]) {
      return res.status(400).json({
        message: "Please input a valid car id to make available.",
      });
    }
    const updateAvailability = await pool.query(
      "UPDATE Car SET availability = $1 WHERE id = $2",
      [true, car_id]
    );

    return res.status(200).json({
      message: `Car with id ${car_id} is now available for rental.`,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}, Please try again later.`,
    });
  }
};
