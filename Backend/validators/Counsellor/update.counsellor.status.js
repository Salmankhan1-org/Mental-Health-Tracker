const { body, query, param, validationResult } = require("express-validator");

exports.UpdateCounsellorStatusValidator = [
  param("counsellorId")
    .notEmpty()
    .withMessage("Counsellor Id is required"),

  body("status")
    .optional()
    .isString()
    .withMessage("Status must be a string"),

  query("status")
    .optional()
    .isString()
    .withMessage("Status must be a string"),
];