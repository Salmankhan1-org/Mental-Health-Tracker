const express = require('express');
const { GenerateDailyWellnessTip } = require('../../controllers/DailyWellnessTip/generate.daily.wellness.tip');
const { isAuthenticated } = require('../../middlewares/authToken');
const router = express.Router();

router.get('/daily-tip/new',isAuthenticated , GenerateDailyWellnessTip);

module.exports = router;