const Thread = require("../../models/Community/community.thread.model");

exports.GetFilteredThreadsController = async (request, response) => {
    try {
        const {
            searchTerm,
            topics, 
            page = 1,
            limit = 5
        } = request.body;

        const parsedPage = Math.max(1, parseInt(page));
        const parsedLimit = Math.max(1, parseInt(limit));

   
        let query = {
            status: "active",
            isDeleted: false
        };

      
         let parsedTopics = []

        if (topics) {
            if (Array.isArray(topics)) {
                parsedTopics = topics
            } else if (typeof topics === "string") {
                parsedTopics = [topics]
            }
        }

        if (parsedTopics.length > 0) {
            query.topic = { $in: parsedTopics }
        }

        // search optimization
        if (searchTerm && searchTerm.trim() !== "") {
        const regex = new RegExp(searchTerm.trim(), "i")

        query.$or = [
            { content: regex },
            { tags: regex },
            { moodLabel: regex }
        ]
        }

        // Count FIRST
        const totalThreads = await Thread.countDocuments(query);

        //  prevent invalid page
        const totalPages = Math.ceil(totalThreads / parsedLimit);
        const safePage = parsedPage > totalPages ? totalPages || 1 : parsedPage;

        const skip = (safePage - 1) * parsedLimit;

        const threads = await Thread.find(query)
        .populate("user", "name avatar isVerified")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(); // performance boost


       
        const sanitizedThreads = threads.map(thread => {
            const threadObj = thread;
         
            threadObj.isMine = request?.user && thread.user._id.toString() === request.user._id.toString();
            if (threadObj.isAnonymous) {
                delete threadObj.user;
            }
            return threadObj;
        });

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            data: {
                threads: sanitizedThreads,
                pagination: {
                    total: totalThreads,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(totalThreads / limit)
                }
            },
            message: 'Threads retrieved successfully'
        });

    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: error?.field || 'server',
                    message: error?.message || 'Error while filtering the threads'
                }
            ],
            message: ''
        });
    }
};