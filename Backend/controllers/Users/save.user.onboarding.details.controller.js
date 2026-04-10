const redisClient = require('../../config/redis');
const User = require('../../models/User/userModel');
const {GetUserId} = require('../../utils/User/get.user.id');

exports.SaveUserOnboardingDetailsController = async(request, response)=>{
    try {

        const userId = GetUserId(request);
        const redisKey = `user:${userId}`;

        const data = request.body;

        const user = await User.findByIdAndUpdate(userId, {
            preferences: data,
            onboardingCompleted: true
            },
            {returnDocument: 'after'}
        )
        

        if(!user){
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'user',
                        error: 'User not Found'
                    }
                ],
                message: ''
            })
        }

        await redisClient.del(redisKey);

        response.status(200).json({
            statusCode: 201,
            success: true,
            error:[],
            message: 'Preferences has been saved'
        })
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: error?.field || 'server',
                    message: error?.message
                }
            ],
            message: ''
        })
    }
}