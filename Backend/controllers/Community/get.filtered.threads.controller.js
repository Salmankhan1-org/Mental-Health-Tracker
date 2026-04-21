const mongoose = require('mongoose');
const Thread = require('../../models/Community/community.thread.model');
const ThreadReaction = require('../../models/Community/thread.reactions.model');
const { GetUserId } = require("../../utils/User/get.user.id");

exports.GetFilteredThreadsController = async (request, response) => {
    try {
        const { searchTerm, topics, page = 1, limit = 5 } = request.body;

        const userId = GetUserId(request)
        ? new mongoose.Types.ObjectId(GetUserId(request))
        : null;

        const parsedPage = Math.max(1, parseInt(page));
        const parsedLimit = Math.max(1, parseInt(limit));

        let matchQuery = {
            status: "active",
            isDeleted: false
        };

        let parsedTopics = [];

        if (topics) {
            parsedTopics = Array.isArray(topics) ? topics : [topics];
        }

        if (parsedTopics.length > 0) {
            matchQuery.topic = { $in: parsedTopics };
        }

        if (searchTerm && searchTerm.trim() !== "") {
            const regex = new RegExp(searchTerm.trim(), "i");
            matchQuery.$or = [
                { content: regex },
                { tags: regex },
                { moodLabel: regex }
            ];
        }

        const totalThreads = await Thread.countDocuments(matchQuery);

        const totalPages = Math.ceil(totalThreads / parsedLimit);
        const safePage = parsedPage > totalPages ? totalPages || 1 : parsedPage;
        const skip = (safePage - 1) * parsedLimit;

        //  AGGREGATION STARTS HERE
        const threads = await Thread.aggregate([
            { $match: matchQuery },

            { $sort: { createdAt: -1 } },

            { $skip: skip },
            { $limit: parsedLimit },

            //  Populate user
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$user" },
                    pipeline: [
                    {
                            $match: {
                                $expr: { $eq: ["$_id", "$$userId"] }
                            }
                        },
                        {
                            $project: { name: 1, email: 1, profileImage: 1 }
                        }
                    ],
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

            //  Lookup current user's reaction
            {
                $lookup: {
                from: "threadreactions",
                let: { threadId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$reactedId", "$$threadId"] },
                                    { $eq: ["$user", userId] },
                                    { $eq: ["$onModel", "Thread"] }
                                ]
                            }
                        }
                    },
                    { $project: { type: 1, _id: 0 } }
                ],
                as: "userReactionData"
                }
            },

            //  Extract reaction
            {
                $addFields: {
                    "stats.userReaction":{
                        $first:'$userReactionData.type'
                    }
                }
            },

            //  Cleanup
            {
                $project: {
                    userReactionData: 0
                }
            }
        ]);

        const sanitizedThreads = threads.map(thread => {
            thread.isMine =
                request?.user &&
                thread.user?._id?.toString() === request.user._id.toString();

            if (thread.isAnonymous) {
                delete thread.user;
            }

            return thread;
        });

        response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            data: {
                threads: sanitizedThreads,
                pagination: {
                    total: totalThreads,
                    page: parsedPage,
                    limit: parsedLimit,
                    totalPages
                }
            },
            message: 'Threads retrieved successfully'
        });
    }catch(error){
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