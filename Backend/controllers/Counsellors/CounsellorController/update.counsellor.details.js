const redisClient = require("../../../config/redis");
const Counsellor = require("../../../models/Counsellors/counsellor.model");
const User = require("../../../models/userModel");
const { GetCounsellorId } = require("../../../utils/Counsellors/get.counselor.id");
const { GetUserId } = require("../../../utils/User/get.user.id");

exports.UpdateCounsellorDetailsController = async(request, response)=>{
    try {

        const {name, bio, title, experience, sessionFee, consulatationModes} = request?.body;
        const userId = GetUserId(request);
        const counsellorId = GetCounsellorId(request);
        const redisKey = `user:${userId}`

        const user = await User.findById(userId);

        if(user._id){

            const counsellor = await Counsellor.findById(counsellorId);

            if(counsellor._id){
                if(name) user.name = name;

                await user.save({});

                redisClient.del(redisKey);

                if(bio) counsellor.bio = bio;
                if(experience) counsellor.yearsOfExperience = experience;
                if(title) counsellor.title = title;
                if(sessionFee) counsellor.sessionFee = sessionFee;
                if(consulatationModes?.length > 0){
                    counsellor.consulatationModes = consulatationModes;
                }
                

                await counsellor.save();

                response.status(201).json({
                    statusCode: 201,
                    success: true,
                    error:[],
                    message: 'User or Counsellor has been updated Successfully'
                })
            }else{
                response.status(404).json({
                    statusCode: 404,
                    success: false,
                    error:[
                        {
                            field: 'popup',
                            message: 'User or Counsellor not Found'
                        }
                    ],
                    message: ''
                })
            }
        }else{
            response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'popup',
                        message: 'User or Counsellor not Found'
                    }
                ],
                message: ''
            })
        }


        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
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