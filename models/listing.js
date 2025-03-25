const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: { type: String, required: true },
    filename: { type: String, required: true },
  },
  price: { type: Number, required: true },
  street: { type: String, required: true },
  city: { type: String },
  country: { type: String, required: true },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: [
      "unfurnished",
      "furnished",
      "villa",
      "luxury",
      "pool",
      "farm",
      "shop",
      "pg",
      "flat",
    ],
    required: true,
  },
  isAvailable: { type: Boolean, default: true },
});

//Mongoose middleware to delete all the comments associated with a listing
//on deletion of that listing
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
