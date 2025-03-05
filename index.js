//basic setup
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
  res.send("working");
});

//Listing route || Index route

app.get("/listing", async (req, res) => {
  const listingData = await Listing.find({});
  res.render("listing/listing", { listingData });
});
