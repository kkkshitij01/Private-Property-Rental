const Joi = require("joi");
//Joi is used to add server side validation

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(1),
    street: Joi.string().required(),
    city: Joi.string().required(),
    isAvailable: Joi.boolean(),
    country: Joi.string().required(),
    category: Joi.string()
      .valid(
        "unfurnished",
        "furnished",
        "villa",
        "luxury",
        "pool",
        "farm",
        "shop",
        "pg",
        "flat"
      )
      .required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
