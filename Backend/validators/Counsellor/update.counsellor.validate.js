const { body } = require("express-validator");

exports.UpdateCounsellorValidator = [

  body("title")
    .notEmpty()
    .withMessage("Title or designation is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters")
    .trim(),

  body("bio")
    .notEmpty()
    .withMessage("Bio is required")
    .isLength({ min: 20, max: 1000 })
    .withMessage("Bio must be between 20 and 1000 characters")
    .trim(),

  body("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("User name must be between 3 and 50 characters")
    .trim(),

  body("experience")
    .notEmpty()
    .withMessage("Years of experience is required")
    .isInt({ min: 0, max: 45 })
    .withMessage("Years of experience must be between 0 and 60"),

  body("sessionFee")
    .notEmpty()
    .withMessage("Session Fee is required")
    .isFloat({ min: 0 })
    .withMessage("Session fee must be a valid number"),

  // Consultation Modes
  body("consultationModes")
    .notEmpty()
    .withMessage("Consultation mode is required")
    .isArray({ min: 1 })
    .withMessage("Consultation modes must be an array with at least one mode"),

  body("consultationModes.*")
    .isIn(["Google Meet","In Person", "Email"])
    .withMessage("Consultation mode must be either online or offline"),

];