exports.createBookingReceiptContent = async (
  firstName,
  lastName,
  amount,
  Status,
  car_description,
  referenceNumber,
  email,
  date
) => {
  const html = `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./receipt.css" />
    <title>RECEIPT</title>
  </head>
  <style>
    * {
      margin: 0px;
      padding: 0px;
      box-sizing: border-box;
    }
    .container {
      margin-top: 20px;
      width: 100%;
    }
    .innercontainer {
      width: 60%;
      margin: auto;
      background-color: white;
      border: 1px solid grey;
    }
    .firstdiv {
      width: 100%;
      height: 150px;
      background-color: #2b2185;
    }
    .innerfirstdiv {
      font-size: 30px;
      font-weight: bold;
      color: white;
      font-family: "Courier New", Courier, monospace;
      padding: 20px;
      text-align: center;
    }
    .firstdiv h2 {
      font-size: 22px;
      font-weight: bold;
      color: white;
      font-family: "Courier New", Courier, monospace;
      text-align: center;
    }
    .seconddiv {
      width: 90%;
      margin: auto;
      margin-top: 30px;
      border-bottom: 1px solid grey;
    }
    .seconddiv h3 {
      font-size: 22px;
      font-family: "Courier New", Courier, monospace;
    }
    .seconddiv h3:last-child {
      margin-bottom: 20px;
    }
    .seconddiv h3 span {
      font-size: 18px;
      font-family: "Courier New", Courier, monospace;
    }

    .thirddiv {
      width: 90%;
      margin: auto;
      padding: 30px 0px;
      border-bottom: 1px solid grey;
    }
    footer {
      width: 100%;
      text-align: center;
      font-size: 12px;
      padding: 10px 0px;
      font-family: "Courier New", Courier, monospace;
      font-weight: lighter;
    }
  </style>

  <body>
    <div class="container">
      <div class="innercontainer">
        <div class="firstdiv">
          <div class="innerfirstdiv">
            <h1>DISAK RIDES</h1>
          </div>
          <h2>PAYMENT RECEIPT</h2>
        </div>
        <div class="seconddiv">
        <h3>NAME: <span>${firstName} ${lastName} </span></h3>
        <h3>AMOUNT: <span>#${amount}</span></h3>
        <h3>STATUS: <span>${Status}</span></h3>
        <h3>DATE: <span>${car_description}</span></h3>
          <h3>REF NO: <span>${referenceNumber}</span></h3>
          <h3>EMAIL: <span>${email}</span></h3>
         <h3>DATE: <span>${date}</span></h3>


        </div>
        <div class="thirddiv">
          <h4>
            NOTE: Please make sure you have your payment reciept intact for
            verification...
          </h4>
        </div>
        <footer>
          <h3>©2022 Disak Rides. All Rights Reserved</h3>
        </footer>
      </div>
    </div>
  </body>
</html>`;
  return html;
};
