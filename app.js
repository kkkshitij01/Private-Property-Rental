//basic setup
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate"); // used for layouts
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
const port = 8000;
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const userRouter = require("./routes/user.js");
const reviewRouter = require("./routes/review.js");
const listingRouter = require("./routes/listing.js");
const user = require("./models/user.js");

const sessionOption = {
  secret: "mysupersecrectcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//Importing mongoDB models

//Connecting to data base
const MONGO_URL = "mongodb://127.0.0.1:27017/property-rental";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log(`Server running on http://localhost:${port}`);
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Home Page");
});
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  console.log(res.locals.success);
  next();
});

app.get("/demouser", async (req, res) => {
  const fakeUser = new User({
    email: "student@gmail.com",
    username: "demo-user",
  });
  let regUser = await User.register(fakeUser, "helloworld");
  res.send(regUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//RESPONSE FOR UNDEFINED ROUTE CALL
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//MIDDLEWARE TO HANDLE ERROR
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "error Occured" } = err;
  res.status(statusCode).render("listing/error.ejs", { err });
  // res.status(statusCode).send(message);
});

app.listen(port, () => {
  console.log("Listening to port 8080");
});
