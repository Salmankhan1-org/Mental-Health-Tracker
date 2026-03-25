const redisClient = require("../../config/redis");
const User = require("../../models/userModel");
const { GetUserEmail } = require("../../utils/User/get.user.id");
const LogController = require("../System/logs/log.controller");

exports.UpdateUserPermissionController = async (request, response) => {
    try {

        const newRole = request.body.newRole || request.query.newRole;
        const userId = request.params?.userId;

        const redisKey = `user:${userId}`;
 

        if(!request.body){
            request.body = {}
        }

        request.body.email = GetUserEmail(request);

        if (newRole?.trim() === 'counsellor') {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    {
                        field: 'popup',
                        message: `${newRole} can not be converted to counsellor`
                    }
                ]
            })
        } else {

            const allowedRoles = ['student', 'admin'];

            if (!allowedRoles.includes(newRole.trim())) {
                return response.status(400).json({
                    statusCode: 400,
                    success: false,
                    error: [
                        {
                            field: 'popup',
                            message: 'Invalid role provided'
                        }
                    ]
                })
            }

            const user = await User.findOneAndUpdate(
                { _id: userId, isDeleted: false },
                { role: newRole.trim() },
                { new: true }
            );

            if (!user) {
                return response.status(404).json({
                    statusCode: 404,
                    success: false,
                    error: [
                        {
                            field: 'popup',
                            message: 'User not found'
                        }
                    ],
                    message: ''
                })
            }

            await redisClient.del(redisKey);

            {/*
                * Future Enhancemets
                * Notify User about their permission has updagraded or fowngraded
            */}

            await LogController(request, 'permission-change','success', `${user.name}'s Role has been change to ${newRole}`);
            

            return response.status(200).json({
                statusCode: 200,
                success: true,
                error: [],
                message: 'User Role has been updated'
            });

        }

    } catch (error) {
        await LogController(request, 'status-change','failed', error?.message);
        
        response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: 'popup',
                    message: error?.message || 'Internal Server Error'
                }
            ],
            message: ''
        })
    }
};