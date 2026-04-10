const { ThreadQueue } = require("../../config/analyze.thread.queue")
const Thread = require("../../models/Community/community.thread.model")
const { GetUserId } = require("../../utils/User/get.user.id")

exports.CreateNewThreadController = async (request, response) =>{
    try {

        const userId = GetUserId(request)

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

        //  Create thread
        const thread = await Thread.create({
            user: userId,
            moodLabel: emotion,
            topic,
            content,
            isAnonymous: isAnonymous || false,
            anonymousIdentity
        })

     
    
        // To Get More details about thread using AI Asynchronously
        
        await ThreadQueue.add("analyze-thread", {
            threadId: thread._id
        })
    

        return response.status(201).json({
            statusCode: 201,
            success: true,
            error: [],
            message: "Thread created successfully",
            data: thread
        })

        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: error?.field || 'server',
                    message: error?.message || 'Error while creating thread'
                }
            ],
            message: ''
        })
    }
}
