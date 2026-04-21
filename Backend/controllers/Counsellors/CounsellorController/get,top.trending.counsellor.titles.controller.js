const Counsellor = require("../../../models/Counsellors/counsellor.model");


exports.GetTopTitlesController = async (request, response) => {
    try {
        const topTitles = await Counsellor.aggregate([
            {
                $group: {
                    _id: "$title",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    _id: 0,
                    title: "$_id",
                    count: 1
                }
            }
        ]);

        return response.status(200).json({
            statusCode: 500,
            success: true,
            error:[],
            data: topTitles,
            message: "Top titles fetched successfully"
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
};