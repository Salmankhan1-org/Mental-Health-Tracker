const Log = require("../../../models/system/log.model");
const { GetUserEmail } = require("../../../utils/User/get.user.id")
const LogController = require("./log.controller")

exports.GetLogsController = async(request, response) =>{
    try {

        if(!request.body){
            request.body = {}
        }

        request.body.email = GetUserEmail(request);

        const logs = await Log.find({email:request.body.email, status:"success"}).sort({createdAt: -1}).limit(5);

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: "User Logs Fetched",
            data: logs
        })
        
    } catch (error) {
        await LogController(request, "api::info", "failed", `${error?.message}`);
        response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: 'popup',
                    message: error?.message
                }
            ],
            message: ''
        })
    }
}