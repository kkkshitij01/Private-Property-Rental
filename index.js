//basic setup
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");

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

app.listen(8080, () => {
  console.log("Listening to port 8080");
});
//NEw listing Route
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

// Index route

app.get("/listings", async (req, res) => {
  const listingData = await Listing.find({});
  res.render("listing/index", { listingData });
});

//Post request for adding new listing
app.post("/listings", async (req, res) => {
  Listing.insertOne(req.body.listing);
  res.redirect("/listings");
});

//show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id);
  res.render("listing/show.ejs", { data });
});

//Edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });
});

//update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  console.log(listing);
  res.redirect("/listings");
});
