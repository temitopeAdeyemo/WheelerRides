const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const pool = require("../database/sql_db");
const dotenv = require("dotenv").config();
const createPDF = require("../template/reciept");
const createBookingReceiptContent = require("../template/htmlContent");
const path = require("path");

//  Posting cars to the database
const rentalDetail = async (req, res, next) => {
  try {
    let mongoUserId;
    if (!req.session.token) {
      mongoUserId = req.user._id;
    } else {
      mongoUserId = await jwt.verify(req.session.token, process.env.JWT_TOKEN).id;
    }
    const { deliveryType, reference_code, returnDate, pickUpDate } = req.body;

    const { car_ids } = req.query;
    console.log("query", car_ids);
    const rentedCars = [];
    let amount = [];
    const dateOne = new Date(returnDate);
    const dateTwo = new Date(pickUpDate);
    const time_difference = dateOne.getTime() - dateTwo.getTime();
    const numberOfDays = time_difference / (1000 * 3600 * 24);

    let rentedCarsDescription = "";
    let total = 0;
    let totalRent = 1;
    // Condition and logic to loop through array of selected cars or a single selected car for rentals and populating their details
    if (
      typeof req.query.car_ids === "string" ||
      typeof req.query.car_ids === "number"
    ) {
      req.query.car_ids = req.query.car_ids.toString().split();
      rentalDetails = await pool.query("SELECT * FROM Car WHERE id = $1", [
        car_ids,
      ]);
      // console.log(rentalDetails.rows);
      let total = "";
      if (rentalDetails.rows[0] == null || rentalDetails.rows.length == 0) {
        return res.status(400).json({
          message: `the car with id ${car_ids} is not available at the moment...`,
        });
      } else {
        description = `${rentalDetails.rows[0].transmission} ${rentalDetails.rows[0].manufacturer} ${rentalDetails.rows[0].brand} ${rentalDetails.rows[0].year} model with id of ${rentalDetails.rows[0].id} (#${rentalDetails.rows[0].rentperhour} per day)`;
        amount.push(parseInt(rentalDetails.rows[0].rentperhour));
        rentedCars.push(description);
        rentedCarsDescription = description;
        total = rentalDetails.rows[0].rentperhour;
      }
      totalRent = total * numberOfDays;
    } else {
      for (car_id of req.query.car_ids) {
        rentalDetails = await pool.query("SELECT * FROM Car WHERE id = $1", [
          car_id,
        ]);
        if (rentalDetails.rows[0] == null || rentalDetails.rows.length == 0) {
          return res.status(400).json({
            message: `This car with id ${car_id} is not available at the moment...`,
          });
        } else {
          description = `${rentalDetails.rows[0].geartype} ${rentalDetails.rows[0].carname} ${rentalDetails.rows[0].brandname} ${rentalDetails.rows[0].caryear} model with id of ${rentalDetails.rows[0].id} (#${rentalDetails.rows[0].rentperday} per day)`;
          amount.push(parseInt(rentalDetails.rows[0].rentperhour));
          rentedCars.push(description);
        }
      }
      rentedCarsDescription = rentedCars.join(` , `);

      for (num of amount) {
        total = total + num;
      }
      totalRent = total * numberOfDays;
    }

    const userData = await User.findOne({ mongoUserId });
    // Assigning Users datas to the new rental to be created
    firstName = userData.firstName;
    lastName = userData.lastName;
    email = userData.email;
    // Setting a default date to the date column on the table
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    let dateAndTime = `${date} ${time}`;
    transactionDate = dateAndTime;
    paymentStatus = "Not Paid Or Unsuccessful";
    carId = req.query.car_ids.toString("").split(",");

    const newRental = await pool.query(
      "INSERT INTO Rentals (user_mongodb_id, firstName, lastName, email, Car_ids, car_description, deliveryType, reference_code, pickUpDate, returnDate, totalAmount, paymentStatus, transactionDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
      [
        mongoUserId,
        firstName,
        lastName,
        email,
        carId,
        rentedCarsDescription,
        deliveryType,
        reference_code,
        pickUpDate,
        returnDate,
        totalRent,
        paymentStatus,
        transactionDate,
      ]
    );
    console.log("newRental.rows[0]", newRental.rows[0]);
    req.session.rental_id = newRental.rows[0].id;
    console.log("req.session.rental_id", req.session.rental_id);
    return res.status(201).json({
      message: `New rent initiated.`,
      newRental: newRental.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `${error.message}, Please try again later.`,
    });
  }
};

const pdfReciept = async (req, res, next) => {
  try {
    const { id } = req.query;
    const details = await pool.query("SELECT * FROM rentals WHERE id = $1", [
      id,
    ]);
    if (
      details.rows[0].paymentstatus !== "Successful" ||
      details.rows[0].reference_code == null ||
      details.rows[0].totalamount == NaN ||
      details.rows[0].totalamount == null
    ) {
      return res.status(400).json({
        message: "Transaction not completed or does not exist...",
      });
    }

    const bookingReceiptContentt =
      await createBookingReceiptContent.createBookingReceiptContent(
        details.rows[0].firstname,
        details.rows[0].lastname,
        details.rows[0].totalamount,
        details.rows[0].paymentstatus,
        details.rows[0].car_description,
        details.rows[0].reference_code,
        details.rows[0].email,
        details.rows[0].transactiondate
      );
    const documentName = `${details.rows[0].firstname}-payment-reciept`;
    const receiptPdf = await createPDF(bookingReceiptContentt, documentName);
    await res.download(
      `../Disak_Project/src/public/files/bookingReceipts/${documentName}.pdf`
    );
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  rentalDetail,
  pdfReciept,
};
