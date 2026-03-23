const { body } = require('express-validator');

exports.AcceptAppointmentValidator = [
    //  Meeting Method
    body('meetingMethod')
        .notEmpty()
        .withMessage('Meeting method is required')
        .isIn(['google-meet', 'phone', 'in-person'])
        .withMessage('Invalid meeting method'),

    //  Google Meet → requires link
    body('meetingLink')
        .if(body('meetingMethod').equals('google-meet'))
        .notEmpty()
        .withMessage('Meeting link is required')
        .isURL()
        .withMessage('Meeting link must be a valid URL'),

    //  In-person → requires location
    body('location')
        .if(body('meetingMethod').equals('in-person'))
        .notEmpty()
        .withMessage('Location is required'),

    //  Phone → requires number
    body('phoneNumber')
        .if(body('meetingMethod').equals('phone'))
        .notEmpty()
        .withMessage('Phone number is required')
        .isMobilePhone()
        .withMessage('Invalid phone number'),
];