const express = require("express");
const { MoodCheckInController } = require("../../controllers/MoodCheckIN/mood.analysis.user");
const { isAuthenticated } = require("../../middlewares/authToken");
const { IsUserAlreadyCheckedInTodayController } = require("../../controllers/MoodCheckIN/get.today.checkin");
const { GetWeeklyUserMoodStats } = require("../../controllers/MoodCheckIN/get.weekly.mood.stats");
const { GetWeeklyMoodChartController } = require("../../controllers/MoodCheckIN/get.weekly.mood.chart");
const { GetWeeklySentimentController } = require("../../controllers/MoodCheckIN/get.weekly.mood.sentiments");
const { GetTodayEmotionsController } = require("../../controllers/MoodCheckIN/get.today.emotions");
const { GetTodayGuidanceController } = require("../../controllers/MoodCheckIN/get.today.guidance.controller");
const router = express.Router();

router.post('/check-in', 
    isAuthenticated,  
    MoodCheckInController
);

router.get('/today/status', 
    isAuthenticated, 
    IsUserAlreadyCheckedInTodayController
);

router.get('/weekly/status',
    isAuthenticated, 
    GetWeeklyUserMoodStats
);
router.get('/weekly/mood/chart',
    isAuthenticated,  
    GetWeeklyMoodChartController
);

router.get('/weekly/sentiment/status',
    isAuthenticated, 
    GetWeeklySentimentController
);

router.get('/emotions/today', 
    isAuthenticated, 
    GetTodayEmotionsController
);

router.get('/guidance/latest',
    isAuthenticated,
    GetTodayGuidanceController
)

module.exports = router;