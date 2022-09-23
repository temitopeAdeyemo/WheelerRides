const express = require("express");
const Post = require("./models/blog_post.model");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const passportSetup = require("./service/passport-setup");
const keys = require("./utils/keys");
const passport = require("passport");
const cookieSession = require("cookie-session");
const carRouter = require("./routes/car.route");
const userRouter = require("./routes/user.route");
const commentRouter = require("./routes/comment.route");
const postRouter = require("./routes/post.route");
const adminRouter = require("./routes/admin.route");
const socialRouter = require("./routes/social-signin.route");
const connectDB = require("./database/db");
const rentalRouter = require("./routes/rental.route");
const paymentRouter = require("./routes/payment.route");
const session = require("express-session");
const flash = require("connect-flash");
const pool = require("./database/sql_db");

// calling express.json to post and get datas in json formats.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.set("view engine", "ejs");
app.use(flash());
app.use(express.static("src/public"));
app.use(express.static("src/uploads/"));
app.use(passport.initialize());
app.use(passport.session());

// calling the database function
connectDB();

// creating a router path for app
app.use("/api/v1", carRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", commentRouter);
app.use("/api/v1", postRouter);
app.use("/api/v1", adminRouter);
app.use("/api/v1", rentalRouter);
app.use("/api/v1", paymentRouter);
app.use("/auth", socialRouter);

//endpoint for the base url..
app.get("/about", (req, res) => {
  res.render("about", { user: req.session.user });
});
app.get("/services", (req, res) => {
  res.render("services", { user: req.session.user });
});
app.get("/login", (req, res) => {
  res.render("login", { user: req.session.user });
});

app.get("/payment", (req, res) => {
  res.render("payment", {
    rental_id: req.session.rental_id,
    user: req.session.user,
  });
});

app.get("/car", (req, res) => {
  res.render("car-portal", { user: req.session.user });
});

app.get("/post-car", (req, res) => {
  res.render("add-car", { user: req.session.user });
});

app.get("/view-all", (req, res) => {
  res.render("all-cars", { user: req.session.user });
});

app.get("/blog", (req, res) => {
  res.render("blog-portal", { user: req.session.user });
});

app.get("/add-post", (req, res) => {
  res.render("add-blog", { user: req.session.user });
});

app.get("/contact", (req, res) => {
  res.render("contact", { user: req.session.user });
});

app.get("/pricing", async (req, res) => {
  try {
    const cars = await pool.query("SELECT * FROM Car");
    // Setting the page not found condition
    if (cars.rows[0] == null || !cars.rows[0] || cars.rows[0] == []) {
      return res.render("all-cars", {
        items: [],
        user: req.session.user,
      });
    }

    req.session.allCars = cars.rows;

    res.render("pricing", {
      user: req.session.user,
      items: req.session.allCars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `${error.message}, Please try again later.`,
    });
  }
});

app.get("/", async (req, res) => {
  try {
    const cars = await pool.query(`SELECT * FROM Car`);

    if (cars.rows[0] == null || !cars.rows[0] || cars.rows[0] == []) {
      return res.render("index", {
        items: [],
        user: req.session.user,
        posts: [],
      });
    }

    let shuffledCars = cars.rows.sort(() => Math.random() - 0.5);

    if (shuffledCars.length > 12) {
      shuffledCars.length = 12;
    }

    const posts = await Post.find();
    req.session.all_posts = posts;
    let shuffledPosts = posts.sort(() => Math.random() - 0.5);

    if (shuffledPosts.length > 3) {
      shuffledPosts.length = 3;
    }

    req.session.postsToShow = shuffledPosts;
    req.session.itemToShow = shuffledCars;

    if (req.user) {
      req.session.user = req.user;
    }

    res.render("index", {
      user: req.session.user,
      items: req.session.itemToShow,
      posts: req.session.postsToShow,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}, Please try again later.`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`App is listening to PORT ${PORT}`);
});
