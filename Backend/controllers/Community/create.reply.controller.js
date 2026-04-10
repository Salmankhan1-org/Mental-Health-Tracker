const ThreadReply = require("../../models/Community/thread.reply.model");
const { GetUserId } = require("../../utils/User/get.user.id");

exports.CreateNewReplyController = async(request, response)=>{
    try {
        const {threadId} = request.params;

        const userId = GetUserId(request);
        
        const {content, isAnonymous} = request.body;

        //  Generate anonymous identity
        let anonymousIdentity = null

        if (isAnonymous) {
            const names = [
                "Quiet Willow",
                "Calm River",
                "Brave Soul",
                "Soft Breeze",
                "Gentle Mind",
                "Peaceful Heart"
            ]

            anonymousIdentity =
                names[Math.floor(Math.random() * names.length)]
        }


        const reply = await ThreadReply.create({
            user: userId,
            isAnonymous: isAnonymous ? true : false,
            content,
            thread: threadId,
            anonymousIdentity
        });

        if(!reply){
            return response.status(401).json({
                statusCode: 401,
                success: false,
                error:[
                    {
                        field: 'thread reply',
                        message: 'Failed to create Thread Reply'
                    }
                ],
                message: ''
            })
        }

        response.status(201).json({
            statusCode: 201,
            success: true,
            error:[],
            message: 'Reply Has been Created Successfully'
        });

    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: error?.field || 'server',
                    message: error?.message || 'Error while creating reply'
                }
            ],
            message: ''
        })
    }
}