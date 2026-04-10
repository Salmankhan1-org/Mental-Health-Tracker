const { ThreadQueue } = require("../../config/analyze.thread.queue");
const Thread = require("../../models/Community/community.thread.model");

exports.UpdateCommunityThreadController = async (request, response)=>{
    try {

        const {threadId} = request.params;

        const { emotion, topic, content, isAnonymous } = request.body

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


        const thread = await Thread.findByIdAndUpdate(threadId, {
            isAnonymous: isAnonymous || false,
            anonymousIdentity,
            content,
            moodLabel: emotion,
            topic
        },{returnDocument: 'after'});


        if(!thread){
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'Thread',
                        message: 'Thread not found'
                    }
                ],
                message: ''
            })
        }

        // Analyze thread because user may have changed the content
        await ThreadQueue.add("analyze-thread", {
            threadId: thread._id
        })
        

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'Thread has been updated'
        })
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: error?.field || 'server',
                    message: error?.message || 'Error while updating the Thread'
                }
            ],
            message: ''
        })
    }
}