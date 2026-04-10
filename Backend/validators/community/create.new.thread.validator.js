const { body } = require("express-validator")

const allowedTopics = [
  "Anxiety",
  "Stress",
  "Exams",
  "Relationships",
  "Depression",
  "General"
]

const allowedEmotions = [
  "Anxious",
  "Stressed",
  "Overwhelmed",
  "Sad",
  "Frustrated",
  "Confused",
  "Hopeful",
  "Motivated"
]

exports.CreateThreadValidator = [


    body("emotion")
        .notEmpty().withMessage("Emotion is required")
        .isString().withMessage("Emotion must be a string")
        .isIn(allowedEmotions).withMessage("Invalid topic"),


    body("topic")
        .notEmpty().withMessage("Topic is required")
        .isIn(allowedTopics).withMessage("Invalid topic"),

 
    body("content")
        .notEmpty().withMessage("Content is required")
        .isString()
        .isLength({ min: 10, max: 2000 })
        .withMessage("Content must be between 10–2000 characters"),


    body("isAnonymous")
        .optional()
        .isBoolean().withMessage("isAnonymous must be boolean")
]