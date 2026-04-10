const ThreadReaction = require("../../models/Community/thread.reactions.model");
const { GetUserId } = require("../../utils/User/get.user.id");

exports.ReactOnThreadOrReplyController = async (request, response)=>{
    try {

        const {type} = request.body;
        const userId = GetUserId(request);

        const {reactedId} = request.params;

        const allowedTypes = ['support','relate','hug'];

        if(!allowedTypes.includes(type)){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'data',
                        message: 'Invalid Reaction type'
                    }
                ],
                message: ''
            })
        }

        const reaction = await ThreadReaction.create({
            user: userId,
            onModel: reactedId,
            type
        });

        // update count in thread 

        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: error?.field || 'server',
                    message: error?.message || 'Error while reacting to thread or reply'
                }
            ],
            message: ''
        })
    }
}