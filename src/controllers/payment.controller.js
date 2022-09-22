const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const pool = require("../database/sql_db");
const axios = require("axios");
const dotenv = require("dotenv").config();
const createPDF = require("../template/reciept");
const createBookingReceiptContent = require("../template/htmlContent");
const path = require("path");

const payment = async (req, res, next) => {
  try {
    const { id } = req.query;
    const rentalDetails = await pool.query(
      "SELECT * FROM Rentals WHERE id = $1",
      [id]
    );
    const data = await axios({
      url: "https://api.paystack.co/transaction/initialize",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.paystackSecret}`,
      },
      data: {
        email: rentalDetails.rows[0].email,
        amount: `${rentalDetails.rows[0].totalamount * 100}`,
      },
    });
    console.log(data);
    if (!data.data.data.access_code && !data.data.data.reference) {
      return res.status(400).json({
        message: "access code and reference required.",
      });
    }
    const updateRef = await pool.query(
      "UPDATE Rentals SET reference_code = $1 WHERE id = $2",
      [data.data.data.reference, id]
    );

    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    let dateAndTime = `${date} ${time}`;
    payStatus = rentalDetails.rows[0].paymentstatus;

    const payment = await pool.query(
      "INSERT INTO Payment ( reference_code, rentals_id, amount, paymentDate, paymentstatus ) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        data.data.data.reference,
        rentalDetails.rows[0].id,
        rentalDetails.rows[0].totalamount,
        dateAndTime,
        payStatus,
      ]
    );
    return res.status(200).json({
      data: data.data.data,
      payment: payment.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const paymentVerification = async (req, res, next) => {
  try {
    const { reference_code } = req.query;
    const data = await axios({
      url: `https://api.paystack.co/transaction/verify/${reference_code}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${process.env.paystackSecret}`,
      },
    });
    console.log("data");
    if (data.data.data.gateway_response !== "Successful") {
      return res.status(404).json({
        message: data.data.data.gateway_response,
      });
    }
    // Updating the rental payment status after payment is confirmed
    const updatePayment_status = await pool.query(
      "UPDATE Rentals SET paymentStatus = $1 WHERE reference_code = $2",
      [data.data.data.gateway_response, reference_code]
    );
    // Updating the payment table payment status after payment is confirmed
    const updateStatus = await pool.query(
      "UPDATE Payment SET paymentstatus = $1 WHERE reference_code = $2",
      [data.data.data.gateway_response, reference_code]
    );
    //Setting the rented cars to unavailable after payment is confirmed
    const car_id = await pool.query(
      "SELECT car_ids FROM Rentals WHERE reference_code = $1",
      [reference_code]
    );
    let car_idss = car_id.rows[0].car_ids;
    for (car_ids of car_idss) {
      const updateAvailability = await pool.query(
        "UPDATE Car SET availability = $1 WHERE id = $2",
        [false, car_ids]
      );
    }
    return res.status(200).json({
      data: data.data.data.gateway_response,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  payment,
  paymentVerification,
};
