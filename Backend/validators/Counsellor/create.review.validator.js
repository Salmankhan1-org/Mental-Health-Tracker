const { body } = require("express-validator");

exports.CounsellorReviewValidator = [

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5 characters")
    .trim(),

  body("review")
    .notEmpty()
    .withMessage("Review is required")
    .isLength({ min: 5, max: 500})
    .withMessage("Review must be between 5 and 500 characters")
    .trim(),
];