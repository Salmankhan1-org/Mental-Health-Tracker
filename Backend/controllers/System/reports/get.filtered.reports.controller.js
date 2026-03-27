const Report = require("../../../models/system/report.model");

exports.GetFilteredReportsController = async(request, response)=>{
    try {

        const {
            search,
            status,
            severity,
            date,
            page = 1,
            limit = 5
        } = request.query || request.body;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const pageSize = parseInt(limit);

        let matchQuery = {};
        if (status && status !== 'all') {
            matchQuery.status = status;
        }
        if(severity && severity !== 'all'){
            matchQuery.severity = severity
        }
        if (date) {
           
           const parsedDate = new Date(date);

            const startOfDay = new Date(parsedDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(parsedDate);
            endOfDay.setHours(23, 59, 59, 999);

            matchQuery.createdAt = {
                $gte: startOfDay,
                $lte: endOfDay
            };
        }

        const pipeline = [
            {$match : matchQuery},

            {
                $lookup : {
                    from : 'users',
                    localField: 'reportedBy',
                    foreignField: '_id',
                    pipeline:[
                        { $project: { name : 1, email : 1, profileImage : 1} }
                    ],
                    as : 'studentDetails'
                }
            },

            {$unwind: '$studentDetails'},

            {
                $lookup:{
                    from: 'users',
                    localField: 'against',
                    foreignField: '_id',
                    pipeline:[
                        { $project: { name: 1, email : 1, profileImage: 1} }
                    ],
                    as: 'counsellorDetails'
                }
            },

            {$unwind: '$counsellorDetails'},

            ...(search ? [
                {
                    $match: {
                        $or : [
                            { 'studentDetails.name' : { $regex: search , $options: 'i'} },
                            { 'cousellorDetails.name' : { $regex: search , $options: 'i'} },
                            { 'reason': {$regex : search , $options: 'i'} }
                        ]
                    }
                }
            ] : []) ,

            { $sort :  { createdAt : -1}},

            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [{ $skip: skip }, { $limit: pageSize }]
                }
            }
        ];

        const results = await Report.aggregate(pipeline);

        const reports = results[0].data;
        const total = results[0].metadata[0]?.total || 0;

        response.status(200).json({
            success: true,
            data: {
                reports,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: pageSize,
                    totalPages: Math.ceil(total / pageSize)
                }
            }
        });



        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: 'popup',
                    message: error?.message || 'Internal Server Error'
                }
            ],
            message: ''
        })
    }
}