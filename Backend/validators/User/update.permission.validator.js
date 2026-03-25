const { body, query, param } = require("express-validator");

exports.UpdateRoleValidator = [
  param("userId")
    .notEmpty()
    .withMessage("UserId is required"),

  body("newRole")
    .optional()
    .isString()
    .withMessage("Role must be a string"),

  query("newRole")
    .optional()
    .isString()
    .withMessage("Role must be a string"),
];