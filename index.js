//basic setup
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate"); // used for layouts
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//Importing mongoDB models
const Listing = require("../MajorProject/models/listing");

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

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
//NEw listing Route
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

//Post request for adding new listing
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    await Listing.insertOne(req.body.listing);
    res.redirect("/listings");
  })
);

// Index route

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const listingData = await Listing.find({});
    res.render("listing/index", { listingData });
  })
);

//show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { data });
  })
);

//Edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  })
);

//update route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    res.redirect("/listings");
  })
);

//REVIEWS
// adding a new review
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new Review saved");
    res.redirect(`/listings/${listing._id}`);
  })
);

//DELETE REVIEW ROUTE
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

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
