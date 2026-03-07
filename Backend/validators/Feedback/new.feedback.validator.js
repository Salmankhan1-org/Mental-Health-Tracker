const { body, validationResult } = require("express-validator");

exports.FeedbackValidator = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("feedback")
    .notEmpty()
    .withMessage("Feedback is required")
    .isString()
    .withMessage("Feedback must be a string")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Feedback must be between 10 and 500 characters"),



    (request, response, next) => {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: errors.array().map((err) => ({
                    field: err.path,
                    message: err.msg,
                })),
                message: "Validation Error",
            });
        }

        next();
    }
];