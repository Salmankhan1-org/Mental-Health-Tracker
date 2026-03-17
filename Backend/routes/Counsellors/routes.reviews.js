const express = require('express');
const { isAuthenticated } = require('../../middlewares/authToken');
const { CreateNewReviewForCounsellorController } = require('../../controllers/Counsellors/ReviewController/create.new.review.controller');
const router = express.Router();

router.post('/:counsellorId/new', 
    isAuthenticated,
    CreateNewReviewForCounsellorController
)


module.exports = router;