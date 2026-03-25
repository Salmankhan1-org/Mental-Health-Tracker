const { body, query, param, validationResult } = require("express-validator");

exports.UpdateStatusValidator = [
  param("userId")
    .notEmpty()
    .withMessage("UserId is required"),

  body("status")
    .optional()
    .isString()
    .withMessage("Status must be a string"),

  query("status")
    .optional()
    .isString()
    .withMessage("Status must be a string"),
];