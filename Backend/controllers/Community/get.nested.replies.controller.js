const ThreadReply = require("../../models/Community/thread.reply.model");

exports.GetNestedRepliesController = async (request, response) =>{
    try {

        const {replyId} = request.params;

       const nested = await ThreadReply.find({ parentReply: replyId })
            .populate("user", "name profileImage")
            .sort({ createdAt: 1 }); 

        return response.status(200).json({
            statusCode: 200,
            success: true,
            data: nested.map(n => ({
                id: n._id,
                author: n.isAnonymous ? (n.anonymousIdentity || 'Quiet Willow') : n.user?.name,
                content: n.content,
                timestamp: n.createdAt,
                isAnonymous: n.isAnonymous,
                isEdited: n.isEdited,
                stats: n.stats 
            })),
            message: 'Nested Replies',
            error:[]
        });
        
    } catch (error) {
        return response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                { 
                    field: 'server', 
                    message: error.message 
                }
            ],
            message: ''
        });
    }
}