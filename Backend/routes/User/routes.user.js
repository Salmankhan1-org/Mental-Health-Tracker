const express = require("express");
const { CreateUserAccountController } = require("../../controllers/Users/createAccount");
const { UserLoginController } = require("../../controllers/Users/login");
const { isAuthenticated } = require("../../middlewares/authToken");
const { GetUserDetailsController } = require("../../controllers/Users/get.user.details");
const { LogoutUserController } = require("../../controllers/Users/logout");
const { GetLogsController } = require("../../controllers/System/logs/get.logs.controller");
const { AuthorizeAdmin } = require("../../middlewares/auth.admin");
const { GetAllUsersByAdminWithStatsController } = require("../../controllers/Users/get.all.users.by.admin");
const { UserFilterValidator } = require("../../validators/User/filter.user.validator");
const { GetFilteredUsersController } = require("../../controllers/Users/get.filtered.Users");
const { Validate } = require("../../middlewares/validate.request");
const { DeleteUserByAdminController } = require("../../controllers/Users/delete.user.controller");
const { UpdateUserPermissionController } = require("../../controllers/Users/update.user.permissions");
const { UpdateRoleValidator } = require("../../validators/User/update.permission.validator");
const { UpdateUserStatusController } = require("../../controllers/Users/update.user.status.controller");
const { UpdateStatusValidator } = require("../../validators/User/update.status.validator");
const { GetFilteredReportsController } = require("../../controllers/System/reports/get.filtered.reports.controller");
const { FilteredReportsValidator } = require("../../validators/User/filter.reports.validator");
const { HandleReportController } = require("../../controllers/System/reports/handle.report.controller");
const { ContactToCounsellorController } = require("../../controllers/Counsellors/CounsellorController/contact.counsellor.controller");
const { GetCriticalReportsController } = require("../../controllers/System/reports/get.critical.reports");
const { GetRecentActivitiesController } = require("../../controllers/System/logs/get.recent.activities.controller");
const { GetAdminDashboardStatsController } = require("../../controllers/Users/get.admin.dashboard.stats.controller");
const {  SaveUserOnboardingDetailsController } = require("../../controllers/Users/save.user.onboarding.details.controller");
const router = express.Router();



router.post("/create-account", 
    CreateUserAccountController
);

router.post("/login", 
    UserLoginController
);

router.get("/logout", 
    isAuthenticated, 
    LogoutUserController
);

router.get("/user/details", 
    isAuthenticated, 
    GetUserDetailsController
);

router.post('/onboarding/save',
    isAuthenticated,
    SaveUserOnboardingDetailsController
)

router.get('/admin/filter-reports',
    isAuthenticated,
    AuthorizeAdmin,
    FilteredReportsValidator,
    Validate,
    GetFilteredReportsController
)

// admin routes
// router.get('/admin/users',
//     isAuthenticated,
//     AuthorizeAdmin,
//     GetAllUsersByAdminWithStatsController
// )

router.get('/admin/critical/reports',
    isAuthenticated,
    AuthorizeAdmin,
    GetCriticalReportsController
)

router.get('/admin/recent/activities',
    isAuthenticated,
    AuthorizeAdmin,
    GetRecentActivitiesController
)

router.get('/admin/dashboard/stats',
    isAuthenticated,
    AuthorizeAdmin,
    GetAdminDashboardStatsController
)

router.get('/admin/filter-users',
    isAuthenticated,
    AuthorizeAdmin,
    UserFilterValidator,
    Validate,
    GetFilteredUsersController
)

router.delete('/admin/:userId',
    isAuthenticated,
    AuthorizeAdmin,
    DeleteUserByAdminController
)

router.post('/admin/:receiverId/message/send',
    isAuthenticated,
    AuthorizeAdmin,
    ContactToCounsellorController
)

router.patch('/admin/report/:reportId',
    isAuthenticated,
    AuthorizeAdmin,
    HandleReportController
)

router.patch('/admin/update/permission/:userId',
    isAuthenticated,
    AuthorizeAdmin,
    UpdateRoleValidator,
    Validate,
    UpdateUserPermissionController
)

router.patch('/admin/update/status/:userId',
    isAuthenticated,
    AuthorizeAdmin,
    UpdateStatusValidator,
    Validate,
    UpdateUserStatusController
)

// Get User Success Logs
router.get("/logs", isAuthenticated, GetLogsController);

module.exports = router;