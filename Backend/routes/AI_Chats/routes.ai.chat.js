const express = require("express");
const { AIChatController } = require("../../controllers/AI_Chat/ai.chat.controller");
const { isAuthenticated } = require("../../middlewares/authToken");
const { GetUserAIChatsController } = require("../../controllers/AI_Chat/get.user.ai.chats");
const router = express.Router();

router.post("/new",isAuthenticated,  AIChatController);
router.get("/get/all", isAuthenticated, GetUserAIChatsController);

module.exports = router;