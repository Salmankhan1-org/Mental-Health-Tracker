const ThreadReply = require("../../models/Community/thread.reply.model");
const mongoose = require('mongoose');

exports.GetThreadRepliesController = async (request, response) => {
    try {
        const { threadId } = request.params;
      
        const skip = parseInt(request.query.skip) || 0;
        const limit = parseInt(request.query.limit) || 3;

        
        const [replies, totalReplies] = await Promise.all([
            await ThreadReply.aggregate([
           {
                $match:{
                    thread: new mongoose.Types.ObjectId(threadId)
                }
           },
           {
                $sort:{createdAt:1}
           },
           {$skip:skip},
           {$limit:limit},
           {
                $lookup:{
                    from : 'users',
                    let: {userId:'$user'},
                    pipeline:[
                        {
                            $match:{
                                $expr: { $eq: ['$_id','$$userId']}
                            }
                        },
                        {
                            $project:{
                                _id:1,
                                name:1,
                                profileImage: 1
                            }
                        }
                    ],
                    as:'user'
                }
           },
           {
                $unwind: {path:'$user', preserveNullAndEmptyArrays:true}
           }

            ]),
            await ThreadReply.countDocuments({thread:threadId})
        ])

        const sanitizedReplies = replies.map(reply=>{
            reply.isMine =  request?.user &&
                reply.user?._id?.toString() === request.user._id.toString();

            if(reply.isAnonymous){
                delete reply.user;
            }

            return reply;
        })

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            data: {
                replies:sanitizedReplies,
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