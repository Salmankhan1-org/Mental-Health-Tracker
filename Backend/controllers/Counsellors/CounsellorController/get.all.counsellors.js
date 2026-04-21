const Counsellor = require("../../../models/Counsellors/counsellor.model");

exports.GetAllCounsellorsController = async (request, response) => {
    try {
        const { skip = 0, searchQuery = "", title = "" } = request.query;
        const limit = 6;
        const parsedSkip = parseInt(skip);

        const matchStage = {};

        // Search logic
        if (searchQuery) {
            matchStage.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { bio: { $regex: searchQuery, $options: "i" } },
                { "user.name": { $regex: searchQuery, $options: "i" } },
            ];
        }

        // Filter logic for titles
        if (title) {
            const titlesArray = title.split(",");
            matchStage.title = { $in: titlesArray };
        }

        const commonStages = [
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            // Important: Apply match after unwind so user.name can be searched
            Object.keys(matchStage).length > 0 ? { $match: matchStage } : null,
        ].filter(Boolean);

        const [results] = await Counsellor.aggregate([
            ...commonStages,
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: parsedSkip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                bio: 1,
                                location: 1,
                                virtualSessions: 1,
                                expertiseTags: 1,
                                rating: 1,
                                "user._id": 1,
                                "user.name": 1,
                                "user.profileImage": 1,
                                yearsOfExperience: 1,
                                sessionFee: 1,
                                consultationModes: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        const counsellors = results.data;
        const totalCount = results.metadata[0]?.total || 0;

        return response.status(200).json({
            statusCode:200,
            success: true,
            error:[],
            data: {
                counsellors,
                hasMore: parsedSkip + limit < totalCount,
                totalCount 
            },
            message: 'Filtered Counsellors'
        });

    } catch (error) {
        return response.status(500).json({
            statusCode: 500,
            success: false,
            error: [{ field: 'server', message: error.message }],
            message: 'Internal Server Error'
        });
    }
};