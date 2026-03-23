const redisClient = require("../../../config/redis");
const Counsellor = require("../../../models/Counsellors/counsellor.model");
const { GetCounsellorId } = require("../../../utils/Counsellors/get.counselor.id");
const { GetUserId } = require("../../../utils/User/get.user.id");

exports.GetCounsellorByUserId = async(request,response)=>{
    try {

        const userId = GetUserId(request);

        const redisKey = `counsellor-user:${userId}`;

        const counsellorInRedis = await redisClient.get(redisKey);

        if(counsellorInRedis){
            return response.status(200).json({
                statusCode: 200,
                success: true,
                error: [],
                message: 'Single Counsellor Data',
                data: JSON.parse(counsellorInRedis)
            })
        }

        const counsellor = await Counsellor.findOne({user:userId}).populate('user','name email profileImage');

        if(counsellor._id){
            await redisClient.set(redisKey, JSON.stringify(counsellor), {EX: 900})
            return response.status(200).json({
                statusCode: 200,
                success: true,
                error: [],
                message: 'Single Counsellor Data',
                data: counsellor
            })
        }else{

            response.status(404).json({
                statusCode: 404,
                success: false,
                error: [
                    {
                        field: 'popup',
                        message: 'Counsellor Not Found'
                    }
                ],
                message: ''
            })
        }
        
    } catch (error) {
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