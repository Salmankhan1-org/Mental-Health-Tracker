const mongoose  = require("mongoose");
const ThreadReply = require("../../models/Community/thread.reply.model");
const { GetUserId } = require("../../utils/User/get.user.id");
const ThreadReaction = require("../../models/Community/thread.reactions.model");
const Thread = require("../../models/Community/community.thread.model");


// Get Ids of nested replies if any
const GetNestedReplyIds = async (parentId)=>{
    const stack = [parentId];
    const allIds = [];

    while (stack.length > 0) {
        const currentId = stack.pop();
        allIds.push(currentId);

        const children = await ThreadReply.find(
        { parentReplyId: currentId },
        { _id: 1 }
        ).lean();

        for (const child of children) {
            stack.push(child._id);
        }
    }

    return allIds;
}

exports.DeleteThreadReplyController = async ( request, response)=>{
    // start a transaction session
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        const {replyId} = request.params;

        const userId = GetUserId(request);

        if(!replyId){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'threadReply',
                        error: 'Reply Id not provided'
                    }
                ],
                message:''
            })
        }

        const reply = await ThreadReply.findOne(
            {_id: replyId, user: userId}
        );

        if(!reply){
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'threadReply',
                        error: 'Reply not found'
                    }
                ],
                message:''
            })
        }

        const NestedReplyIds = await GetNestedReplyIds(replyId);

        await ThreadReply.deleteMany({
            _id: {$in:NestedReplyIds}
        },{session});

        await ThreadReaction.deleteMany({
            reactedId: {$in: NestedReplyIds},
            onModel:'ThreadReply'
        },{session})

        // update the number of replyCount of thread
        await Thread.findByIdAndUpdate(reply.thread, {
            $inc: { "stats.replyCount": -NestedReplyIds?.length }
        },{session});

        await session.commitTransaction();

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'Reply has been deleted Successfully',
            data:null
        })
        
    } catch (error) {
        session.abortTransaction();
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: error?.field || 'server',
                    message: error?.message || 'Internal Server Error'
                }
            ],
            message: ''
        })
    }
}