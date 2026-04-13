const ThreadReply = require("../../models/Community/thread.reply.model");

exports.GetThreadRepliesController = async (request, response) => {
    try {
        const { threadId } = request.params;
      
        const skip = parseInt(request.query.skip) || 0;
        const limit = parseInt(request.query.limit) || 3;

        const replies = await ThreadReply.find({ thread: threadId })
            .populate('user', 'name profileImage')
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit);

        console.log("Replies:",replies);

        const totalReplies = await ThreadReply.countDocuments({ thread: threadId });

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            data: {
                replies,
                hasMore: skip + limit < totalReplies,
                total: totalReplies
            },
            message: 'Thread Replies'
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