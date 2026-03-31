const Chat = require("../../models/AI/message.schema");
const { GetUserId, GetUserEmail } = require("../../utils/User/get.user.id");
const LogController = require("../System/logs/log.controller");

exports.GetUserAIChatsController = async(request, response)=>{
    try {

        const userId = GetUserId(request);
        if(!request.body){
            request.body = {}
        }

        request.body.email = GetUserEmail(request);

        const userAiChats = await Chat.findOne({user: userId});

        response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: "User AI Chats",
            data: userAiChats
        })
        
    } catch (error) {
        await LogController(request, "api:info", "failed", `${error?.message}`);
        response.status(500).json({
            statusCode: 500,
            success: true,
            error:[
                {
                    field: 'popup',
                    message: error?.message
                }
            ],
            message: ''
        })
    }
}