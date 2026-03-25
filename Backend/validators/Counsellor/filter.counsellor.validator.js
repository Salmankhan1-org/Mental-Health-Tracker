const { query } = require("express-validator");

const allowedStatuses = ["pending", "approved", "rejected"];
const allowedSort = ["rating", "sessions", "newest"];

exports.FilterCounsellorsValidator = [
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 30 })
    .withMessage("Search must be a valid string"),

  query("specialization")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 30 })
    .withMessage("Specialization must be a valid string"),

  query("status")
    .optional()
    .isIn(allowedStatuses)
    .withMessage("Invalid status value"),

  query("minRating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Min rating must be between 0 and 5"),

  query("maxRating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Max rating must be between 0 and 5"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sortBy")
    .optional()
    .isIn(allowedSort)
    .withMessage("Invalid sort option"),

];