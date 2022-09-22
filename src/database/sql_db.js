// const { Sequelize } = require('sequelize');

// // Option 3: Passing parameters separately (other dialects)
// module.exports = new Sequelize("myProject", "postgres", "123456789", {
//   dialect: "postgres",
//   port: 5050,
// });

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.pghost,
  user: process.env.pguser,
  port: process.env.pgport,
  password: process.env.pgpassword,
  database: process.env.pgdatabase,
  ssl: true
});

pool.query("SELECT NOW()", (err, res) => {
  if (!err) {
    console.log("connected to PGsql");
  } else {
    console.log(err.message);
  }
  //   console.log("connected PGSQL");
});

module.exports = pool;
