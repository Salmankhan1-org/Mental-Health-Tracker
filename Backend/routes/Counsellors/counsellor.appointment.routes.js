const express = require('express');
const { isAuthenticated } = require('../../middlewares/authToken');
const { GetAvailableSlotsByDateController } = require('../../controllers/Counsellors/AppointmentController/get.available.slots.of.day');
const { BookAppointmentValidator } = require('../../validators/Counsellor/book.appointment.validator');
const { Validate } = require('../../middlewares/validate.request');
const { BookSlotForUserController } = require('../../controllers/Counsellors/AppointmentController/book.slot.controller');
const { GetAppointmentsUsingStatusController } = require('../../controllers/Counsellors/AppointmentController/get.appointments.using.status');
const { RejectStudentAppointmentController } = require('../../controllers/Counsellors/AppointmentController/reject.student.appointment.controller');
const { AcceptAppointmentValidator } = require('../../validators/Counsellor/accept.appointment.validator');
const { AcceptStudentAppointmentController } = require('../../controllers/Counsellors/AppointmentController/accept.appointment.controller');
const { CheckIfPendingAppointmentExist } = require('../../controllers/Counsellors/AppointmentController/is.pending.appointment.exist.controller');
const { GetTodaysUpcomingAppointmentsController } = require('../../controllers/Counsellors/AppointmentController/get.todays.upcoming.appointments.controller');
const { GetRecentPendingAppointmentsController } = require('../../controllers/Counsellors/AppointmentController/get.recent.pending.appointment');
const { MarkAppointmentCompletedController } = require('../../controllers/Counsellors/AppointmentController/mark.appointment.completed.controller');
const { VerifyAppointmentActionToken } = require('../../middlewares/verify.appointment.token');
const { ConfirmAppointmentCompletionController } = require('../../controllers/Counsellors/AppointmentController/confirm.appointment.completion.controller');
const router = express.Router();


router.get('/status-filter',
    isAuthenticated,
    GetAppointmentsUsingStatusController
)

//Get todays upcoming appointments
router.get('/today',
    isAuthenticated,
    GetTodaysUpcomingAppointmentsController
)

// confirm appointment completion by user
router.patch('/complete/confirm',
    VerifyAppointmentActionToken,
    ConfirmAppointmentCompletionController
)

router.get('/pending/recent',
    isAuthenticated,
    GetRecentPendingAppointmentsController
)


router.get('/pending/exist',
    isAuthenticated,
    CheckIfPendingAppointmentExist
)


router.get('/:counsellorId/available/slots',
    isAuthenticated,
    GetAvailableSlotsByDateController
)

// Reject Appoinment Route
router.get('/:appointmentId/reject',
    isAuthenticated,
    RejectStudentAppointmentController
)

// Accept Appoinment Route
router.post('/:appointmentId/accept',
    isAuthenticated,
    AcceptAppointmentValidator,
    Validate,
    AcceptStudentAppointmentController
)

router.patch('/:appointmentId/confirm',
    isAuthenticated,
    MarkAppointmentCompletedController
)


// book appointment
router.post('/:counsellorId/slots/:slotId/book/new',
    isAuthenticated,
    BookAppointmentValidator,
    Validate,
    BookSlotForUserController
)


module.exports = router;