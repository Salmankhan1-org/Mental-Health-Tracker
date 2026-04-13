const Thread = require("../../models/Community/community.thread.model");
const ThreadReply = require("../../models/Community/thread.reply.model");
const { GetUserId } = require("../../utils/User/get.user.id");
const ThreadReaction = require('../../models/Community/thread.reactions.model');


exports.ReactOnThreadOrReplyController = async (request, response) => {
    try {
        const { type, onModelType } = request.body; 
        const { reactedId } = request.params;
        const userId = GetUserId(request);

        const allowedTypes = ['support', 'relate', 'hug'];
        if (!allowedTypes.includes(type)) {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    { 
                        field: 'data', 
                        message: 'Invalid Reaction type' 
                    }
                ],
                message: ''
            });
        }

  
        const existingReaction = await ThreadReaction.findOne({
            user: userId,
            reactedId: reactedId
        });

        const TargetModel = onModelType === 'Thread' ? Thread : ThreadReply;
        let message = '';
        let statusCode = 200;

        if (existingReaction) {
            if (existingReaction.type === type) {
                // TOGGLE OFF: Remove reaction if it's the same type
                await ThreadReaction.findByIdAndDelete(existingReaction._id);
                
                // Decrement count in the main model
                await TargetModel.findByIdAndUpdate(reactedId, {
                    $inc: { [`stats.${type}Count`]: -1 }
                });
                
                message = 'Reaction removed';
            } else {
                // SWITCH: Change reaction type
                const oldType = existingReaction.type;
                existingReaction.type = type;
                await existingReaction.save();

                // Decrement old, increment new
                await TargetModel.findByIdAndUpdate(reactedId, {
                    $inc: { 
                        [`stats.${oldType}Count`]: -1,
                        [`stats.${type}Count`]: 1 
                    }
                });
                
                message = 'Reaction updated';
            }
        } else {
            // NEW REACTION
            await ThreadReaction.create({
                user: userId,
                reactedId: reactedId,
                onModel: onModelType, // 'Thread' or 'ThreadReply'
                type
            });

         
            await TargetModel.findByIdAndUpdate(reactedId, {
                $inc: { [`stats.${type}Count`]: 1 }
            });

            statusCode = 201;
            message = 'Reaction added';
        }

        return response.status(statusCode).json({
            statusCode,
            success: true,
            error:[],
            message
        });

    } catch (error) {
        return response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                { 
                    field: 'server', 
                    message: error.message || 'Internal Server Error' 
                }
            ],
            message: ''
        });
    }
};