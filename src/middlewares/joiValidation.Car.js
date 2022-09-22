const joi = require("joi");

const validateCarDetails = joi.object({
  features: joi.string().required(),
  year: joi.number().required(),
  manufacturer: joi.string().required(),
  rentPerHour: joi.number().required(),
  brand: joi.string().required(),
  transmission: joi.string().required(),
  fuelType: joi.string().required(),
  description: joi.string().required(),
  seat: joi.string().required(),
});

module.exports = { validateCarDetails };
