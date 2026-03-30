const User = require("../../models/userModel");
const { GetUserEmail } = require("../../utils/User/get.user.id");
const LogController = require("../System/logs/log.controller");
const UserStatusUpdateEmailTemplate = require('../../templates/user.status.updated.email.template');
const { sendEmail } = require("../../utils/System/send.email");
const redisClient = require("../../config/redis");

exports.UpdateUserStatusController = async(request, response)=>{
    try {

        let statusInput = request.body.status || request.query.status;
        const {reason} = request.body;
        const {userId} = request.params;

        const redisKey = `user:${userId}`;
        
        if(!request.body){
            request.body = {};
        }

        request.body.email = GetUserEmail(request);
        const status = statusInput?.trim().toLowerCase();

        const allowedStatus = ["active", "inactive", "suspended"];

        if (!allowedStatus.includes(status)) {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Invalid status provided",
                    },
                ],
                message: "",
            });
        }

        const user = await User.findOneAndUpdate(
            {_id:userId, isDeleted: false},
            {status: status},
            {returnDocument: 'after'}
        );

        if(!user){
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'popup',
                        message: 'User not Found'
                    }
                ],
                message: ''
            })
        }

        // Notify user about their status Change
        const html = UserStatusUpdateEmailTemplate(
            user?.name,
            status,
            {
                reason
            }
        )

        await sendEmail({
            to: user?.email,
            subject: 'Status Change',
            html
        })

        // Invalidate Redis user cache
        await redisClient.del(redisKey);

        await LogController(request, 'Status Updated','success', `${user.name}'s Status has been change to ${status}. ${status !== 'active' ? `${reason}`:''}`);

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'User Status has been changed'
        });

        
    } catch (error) {
        await LogController(request, 'status-change','failed',error?.message);
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: 'popup',
                    message: error?.message||'Internal Server Error'
                }
            ],
            message: ''
        })
    }
}