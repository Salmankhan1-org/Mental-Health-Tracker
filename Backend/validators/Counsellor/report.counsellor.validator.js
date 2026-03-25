const { body } = require('express-validator');

exports.CreateReportValidator = [
  body('reason')
    .notEmpty().withMessage('Reason is required')
    .isIn([
      'no_show',
      'late_join',
      'unprofessional_behavior',
      'technical_issue',
      'other'
    ]).withMessage('Invalid reason'),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
];