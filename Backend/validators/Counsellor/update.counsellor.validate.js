const { body } = require("express-validator");

exports.UpdateCounsellorValidator = [

  body("name")
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 3, max: 50 }).withMessage("Name must be 3-50 characters")
    .trim(),


  body("title")
    .notEmpty().withMessage("Professional title is required")
    .isLength({ min: 3, max: 100 }).withMessage("Title must be 3-100 characters")
    .trim(),


  body("bio")
    .notEmpty().withMessage("Bio is required")
    .isLength({ min: 20, max: 1500 }).withMessage("Bio must be between 20 and 1500 characters")
    .trim(),


  body("yearsOfExperience")
    .notEmpty().withMessage("Years of experience is required")
    .isInt({ min: 0, max: 60 }).withMessage("Experience must be a realistic number (0-60)"),


  body("sessionFee")
    .optional()
    .notEmpty().withMessage("Session fee is required")
    .isNumeric().withMessage("Session fee must be a valid number"),

  
  body("location")
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage("Location is too long")
    .trim(),


  body("consultationModes")
    .isArray({ min: 1 }).withMessage("Select at least one consultation mode"),

  body("consultationModes.*")
    .isIn(["google-meet", "phone", "in-person"])
    .withMessage("Invalid consultation mode selected"),


  body("expertiseTags")
    .optional()
    .isArray().withMessage("Expertise tags must be an array"),
    
  body("expertiseTags.*")
    .isString().trim().isLength({ min: 2, max: 30 })
    .withMessage("Each tag must be between 2-30 characters"),


  body("profileImage")
    .optional({ checkFalsy: true })
    
    .custom((value) => {
      if (value && !value.startsWith("data:image/")) {
        throw new Error("Invalid image format. Must be a valid image string.");
      }
      return true;
    })
];