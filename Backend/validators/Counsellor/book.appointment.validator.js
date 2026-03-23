const { body } = require('express-validator');
const mongoose = require('mongoose');

exports.BookAppointmentValidator = [
    // 3. Date Validation (YYYY-MM-DD)
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid ISO8601 format (YYYY-MM-DD)')
        .custom((value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            throw new Error('You cannot book an appointment in the past');
        }
        return true;
        }),

    // 4. Time Format (HH:mm)
    body('startTime')
        .notEmpty()
        .withMessage('Start time is required')
        .matches(/^([01]\d|2[0-3]):?([0-5]\d)$/)
        .withMessage('Start time must be in HH:mm format'),

    body('endTime')
        .notEmpty()
        .withMessage('End time is required')
        .matches(/^([01]\d|2[0-3]):?([0-5]\d)$/)
        .withMessage('End time must be in HH:mm format')
        .custom((value, { req }) => {
            if (value <= req.body.startTime) {
                throw new Error('End time must be after start time');
            }
            return true;
        }
    ),

    // 5. Meeting Method Validation
    body('meetingMethod')
        .notEmpty().withMessage('Please select a meeting method')
        .isIn(['google-meet', 'phone', 'in-person'])
        .withMessage('Invalid meeting method. Please choose Zoom, Phone, or In-person.'),

];