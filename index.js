//basic setup
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate"); // used for layouts
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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

app.listen(8080, () => {
  console.log("Listening to port 8080");
});
