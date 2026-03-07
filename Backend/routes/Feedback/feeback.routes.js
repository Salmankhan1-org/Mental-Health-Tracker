const express = require('express');
const { isAuthenticated } = require('../../middlewares/authToken');
const { UserFeedbackController } = require('../../controllers/Feedback/user.feedback.controller');
const { GetUsersFeedbacks } = require('../../controllers/Feedback/get.user.feedbacks');
const { FeedbackValidator } = require('../../validators/Feedback/new.feedback.validator');

const router = express.Router();

router.post('/new',isAuthenticated, FeedbackValidator, UserFeedbackController);
router.get('/all',GetUsersFeedbacks);

module.exports = router;