const { query, body, oneOf } = require('express-validator');

exports.FilteredAppointmentsValidator = [
 
    oneOf([
        [
            query('status')
                .optional()
                .isIn(['pending', 'approved', 'cancelled', 'completed', 'all'])
                .withMessage('Invalid status type'),
            query('search')
                .optional()
                .isString()
                .trim()
                .escape(),
            query('date')
                .optional()
                .isISO8601()
                .withMessage('Date must be a valid ISO8601 format (YYYY-MM-DD)'),
            query('page')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Page must be a positive integer'),
            query('limit')
                .optional()
                .isInt({ min: 1, max: 100 })
                .withMessage('Limit must be between 1 and 100'),
        ],
        [
            body('status')
                .optional()
                .isIn(['pending', 'approved', 'cancelled', 'completed', 'all'])
                .withMessage('Invalid status type'),
            body('search')
                .optional()
                .isString()
                .trim()
                .escape(),
            body('date')
                .optional()
                .isISO8601()
                .withMessage('Date must be a valid ISO8601 format'),
            body('page')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Page must be a positive integer'),
            body('limit')
                .optional()
                .isInt({ min: 1, max: 100 })
                .withMessage('Limit must be between 1 and 100'),
        ]
    ])
];