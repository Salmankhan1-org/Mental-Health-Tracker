const redisClient = require("../../../config/redis");
const Counsellor = require("../../../models/Counsellors/counsellor.model");
const User = require("../../../models/userModel");
const { GetCounsellorId } = require("../../../utils/Counsellors/get.counselor.id");
const { GetUserId } = require("../../../utils/User/get.user.id");

exports.UpdateCounsellorDetailsController = async (request, response) => {
    try {
        const { 
            name, 
            profileImage, 
            bio, 
            title, 
            yearsOfExperience, 
            sessionFee, 
            consultationModes, 
            expertiseTags, 
            location 
        } = request?.body;

        const userId = GetUserId(request);
        const redisKey = `user:${userId}`;
        const counsellorRedisKey =  `counsellor-user:${userId}`;

        const user = await User.findById(userId);

        if (user) {
            const counsellor = await Counsellor.findOne({user:userId});

            if (counsellor) {
                if (name) user.name = name;
                if (profileImage) user.profileImage = profileImage;

                await user.save();
                await redisClient.del(redisKey);

                if (bio) counsellor.bio = bio;
                if (title) counsellor.title = title;
                if (yearsOfExperience !== undefined) counsellor.yearsOfExperience = yearsOfExperience;
                if (sessionFee) counsellor.sessionFee = sessionFee;
                if (location) counsellor.location = location;
                
                if (consultationModes && Array.isArray(consultationModes)) {
                    counsellor.consultationModes = consultationModes;
                }

                if (expertiseTags && Array.isArray(expertiseTags)) {
                    counsellor.expertiseTags = expertiseTags;
                }

                await counsellor.save();

                await redisClient.del(counsellorRedisKey);

                response.status(201).json({
                    statusCode: 201,
                    success: true,
                    error: [],
                    message: 'User and Counsellor details have been updated successfully'
                });
            } else {
                response.status(404).json({
                    statusCode: 404,
                    success: false,
                    error: [
                        {
                            field: 'popup',
                            message: 'Counsellor profile not found'
                        }
                    ],
                    message: ''
                });
            }
        } else {
            response.status(404).json({
                statusCode: 404,
                success: false,
                error: [
                    {
                        field: 'popup',
                        message: 'User not found'
                    }
                ],
                message: ''
            });
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
        });
    }
};