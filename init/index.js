const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data.js");

//connecting to data base
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

const initDB = async () => {
  await Listing.insertMany(initData.data);
  console.log("data was initilized");
};
initDB();
