const express = require('express');
const { isAuthenticated } = require('../../middlewares/authToken');
const { CreateNewCounsellorController } = require('../../controllers/Counsellors/CounsellorController/create.counsellor.controller');
const { CounsellorApplicationValidator } = require('../../validators/Counsellor/create.counsellor.validator');
const { IsUserAlreadyAppliedForCounsellor } = require('../../controllers/Counsellors/CounsellorController/is.already.applied.counsellor');
const { GetAllCounsellorsController } = require('../../controllers/Counsellors/CounsellorController/get.all.counsellors');
const { CreateNewReviewForCounsellorController } = require('../../controllers/Counsellors/ReviewController/create.new.review.controller');
const { CounsellorReviewValidator } = require('../../validators/Counsellor/create.review.validator');
const { Validate } = require('../../middlewares/validate.request');
const { GetSingleCounsellorController } = require('../../controllers/Counsellors/CounsellorController/get.single.counsellor.controller');
const { GetAllReviewsOfACounsellorController } = require('../../controllers/Counsellors/ReviewController/get.all.reviews.counsellor.controller');
const { DeleteUserReviewController } = require('../../controllers/Counsellors/ReviewController/delete.user.review');
const { GetCounsellorReviewStats } = require('../../controllers/Counsellors/ReviewController/get.counsellor.review.stats');
const { UpdateCounsellorDetailsController } = require('../../controllers/Counsellors/CounsellorController/update.counsellor.details');
const { UpdateCounsellorValidator } = require('../../validators/Counsellor/update.counsellor.validate');
const router =  express.Router({});




// Counsellor Review Routes

router.get('/:counsellorId/reviews/all', 
    isAuthenticated,
    GetAllReviewsOfACounsellorController
)


router.post('/:counsellorId/review/new', 
    isAuthenticated,
    CounsellorReviewValidator,
    Validate,
    CreateNewReviewForCounsellorController
)


router.delete('/:counsellorId/review/:reviewId', 
    isAuthenticated, 
    DeleteUserReviewController
);

router.get('/:counsellorId/reviews/stats',
    isAuthenticated,
    GetCounsellorReviewStats
);


// Counsellor Routes

router.post('/apply',
     isAuthenticated, 
     CounsellorApplicationValidator,
     Validate,
     CreateNewCounsellorController
);

router.get('/all',
    isAuthenticated,
    GetAllCounsellorsController
)

router.get('/:counsellorId',
    isAuthenticated, 
    GetSingleCounsellorController
)

router.put('/:counsellorId/update',
    isAuthenticated,
    UpdateCounsellorValidator,
    Validate,
    UpdateCounsellorDetailsController
)


router.get('/apply/already',
    isAuthenticated,
    IsUserAlreadyAppliedForCounsellor
)





module.exports = router;