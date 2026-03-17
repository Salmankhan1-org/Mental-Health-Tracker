const express = require('express');
const { isAuthenticated } = require('../../middlewares/authToken');
const { UpsertNewAvailabilityController } = require('../../controllers/Counsellors/AvailabilityController/availability.schedule.save');
const {  GetCounsellorAvailableSchedulesController } = require('../../controllers/Counsellors/AvailabilityController/get.counsellor.availability');
const { AvailabilityValidator } = require('../../validators/Counsellor/upsert.availability.validator');
const { Validate } = require('../../middlewares/validate.request');

const router = express.Router();

router.post('/counsellor/new',
    isAuthenticated,
    AvailabilityValidator,
    Validate,
    UpsertNewAvailabilityController
)

router.get('/counsellor/schedule',
    isAuthenticated,
    GetCounsellorAvailableSchedulesController
)

module.exports = router;