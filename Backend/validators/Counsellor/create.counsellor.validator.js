const { body, validationResult } = require("express-validator");

exports.CounsellorApplicationValidator = [

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

  body("licenseNumber")
    .notEmpty()
    .withMessage("License number is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("License number must be between 3 and 50 characters")
    .trim(),

  body("experience")
    .notEmpty()
    .withMessage("Years of experience is required")
    .isInt({ min: 0, max: 60 })
    .withMessage("Years of experience must be between 0 and 60"),

  body("location")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters")
    .trim(),

  body("virtualSessions")
    .optional()
    .isBoolean()
    .withMessage("Virtual sessions must be true or false"),

  body("expertiseTags")
    .isArray({ min: 1 })
    .withMessage("At least one expertise tag is required"),

  body("expertiseTags.*")
    .isString()
    .withMessage("Each expertise tag must be a string")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Each expertise tag must be between 2 and 50 characters"),


    
];