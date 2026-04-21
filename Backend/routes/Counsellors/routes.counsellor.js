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
const { GetCounsellorByUserId } = require('../../controllers/Counsellors/CounsellorController/get.counsellor.by.user.id');
const { GetCounsellorDashboardStatsController } = require('../../controllers/Counsellors/CounsellorController/get.counsellor.dashboard.stats.controller');
const { FilterCounsellorsController } = require('../../controllers/Counsellors/CounsellorController/filter.counsellors.controller');
const { AuthorizeAdmin } = require('../../middlewares/auth.admin');
const { FilterCounsellorsValidator } = require('../../validators/Counsellor/filter.counsellor.validator');
const { UpdateCounsellorStatusController } = require('../../controllers/Counsellors/CounsellorController/update.counsellor.status');
const { UpdateCounsellorStatusValidator } = require('../../validators/Counsellor/update.counsellor.status');
const { GetTopTitlesController } = require('../../controllers/Counsellors/CounsellorController/get,top.trending.counsellor.titles.controller');
const router =  express.Router({});


// Get Counselor using userId
router.get('/me',
    isAuthenticated,
    GetCounsellorByUserId
);

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

router.put('/me/update',
    isAuthenticated,
    UpdateCounsellorValidator,
    Validate,
    UpdateCounsellorDetailsController
)

router.get('/trending/titles',
    isAuthenticated,
    GetTopTitlesController
)

router.get('/dashboard/stats', 
    isAuthenticated,
    GetCounsellorDashboardStatsController
)

router.get('/apply/already',
    isAuthenticated,
    IsUserAlreadyAppliedForCounsellor
)

//admin route to filter counsellor
router.get('/admin/filter-counsellors',
    isAuthenticated,
    AuthorizeAdmin,
    FilterCounsellorsValidator,
    Validate,
    FilterCounsellorsController
)


router.get('/:counsellorId',
    isAuthenticated, 
    GetSingleCounsellorController
)


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

router.get('/:counsellorId/reviews/stats',
    isAuthenticated,
    GetCounsellorReviewStats
);

router.patch('/:counsellorId/admin/update/status',
    isAuthenticated,
    AuthorizeAdmin,
    UpdateCounsellorStatusValidator,
    Validate,
    UpdateCounsellorStatusController
)


router.delete('/:counsellorId/review/:reviewId', 
    isAuthenticated, 
    DeleteUserReviewController
);



module.exports = router;