// const joi = require("joi");

// const validateAdminReg = joi.object({
//   firstName: joi.string().required(),
//   lastName: joi.string().required(),
//   age: joi.number().required(),
//   emailAddress: joi
//     .string()
//     .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
//   password: joi.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
//   phoneNumber: joi.string().required().min(10).max(12),
// });

// const validateAdminLogin = joi.object({
//   emailAddress: joi
//     .string()
//     .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
//   password: joi.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
// });

// module.exports = { validateAdminReg, validateAdminLogin };


const joi = require("joi");

const validateReg = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  age: joi.number(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: joi.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  phoneNumber: joi.string().min(10).max(12),
});

const validateLogin = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: joi.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

module.exports = { validateLogin, validateReg };