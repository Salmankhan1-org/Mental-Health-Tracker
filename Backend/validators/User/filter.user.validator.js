const { query } = require("express-validator");

exports.UserFilterValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),

    query("role")
        .optional()
        .isIn(["all", "student", "counsellor", "admin"])
        .withMessage("Invalid role filter selected"),

    query("status")
        .optional()
        .isIn(["active", "inactive", "suspended", "pending"])
        .withMessage("Invalid status filter selected"),

    query("search")
        .optional()
        .isString()
        .trim()
        .escape()
        .isLength({ max: 100 })
        .withMessage("Search term is too long"),
];