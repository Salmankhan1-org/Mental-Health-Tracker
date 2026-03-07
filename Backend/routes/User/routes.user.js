const express = require("express");
const { CreateUserAccountController } = require("../../controllers/Users/createAccount");
const { UserLoginController } = require("../../controllers/Users/login");
const { isAuthenticated } = require("../../middlewares/authToken");
const { GetUserDetailsController } = require("../../controllers/Users/get.user.details");
const { LogoutUserController } = require("../../controllers/Users/logout");
const { GetLogsController } = require("../../controllers/System/logs/get.logs.controller");
const router = express.Router();

router.post("/create-account", CreateUserAccountController);
router.post("/login", UserLoginController);
router.get("/logout", isAuthenticated, LogoutUserController);
router.get("/user/details", isAuthenticated, GetUserDetailsController);

// Get User Success Logs
router.get("/logs", isAuthenticated, GetLogsController);

module.exports = router;