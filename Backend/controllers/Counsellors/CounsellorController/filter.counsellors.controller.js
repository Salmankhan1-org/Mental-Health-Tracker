const Counsellor = require("../../../models/Counsellors/counsellor.model");

exports.FilterCounsellorsController = async (request, response) => {
  try {
    const {
        search,
        specialization,
        status,
        minRating,
        maxRating,
        sortBy = "rating", 
        page = 1,
        limit = 10
    } = request.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const counsellorMatch = {};

    if (status && status !== "all") {
      counsellorMatch.status = status;
    }

    if (specialization) {
      counsellorMatch.title = { $regex: specialization, $options: "i" };
    }

  
    let sortStage = {};
    if (sortBy === "rating") {
      sortStage = { "rating.average": -1 };
    } else if (sortBy === "sessions") {
      sortStage = { completedSessions: -1 };
    } else {
      sortStage = { createdAt: -1 };
    }

    const pipeline = [
      { $match: counsellorMatch },

   
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },

      
      {
        $match: {
          "userDetails.status": "active",
          "userDetails.isDeleted": false
        }
      },

      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "userDetails.name": { $regex: search, $options: "i" } },
                  { "userDetails.email": { $regex: search, $options: "i" } }
                ]
              }
            }
          ]
        : []),

  
      {
        $lookup: {
          from: "appointments",
          let: { counsellorId: "$user" }, // ⚠️ change to "$_id" if needed
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$counsellor", "$$counsellorId"] },
                    { $eq: ["$status", "completed"] }
                  ]
                }
              }
            },
            { $count: "count" }
          ],
          as: "sessions"
        }
      },
      {
        $addFields: {
          completedSessions: {
            $ifNull: [{ $arrayElemAt: ["$sessions.count", 0] }, 0]
          }
        }
      },

  
      ...(minRating || maxRating
        ? [
            {
              $match: {
                "rating.average": {
                  ...(minRating && { $gte: Number(minRating) }),
                  ...(maxRating && { $lte: Number(maxRating) })
                }
              }
            }
          ]
        : []),

   
      { $sort: sortStage },

    
      {
        $project: {
          _id: 1,
          title: 1,
          location:1,
          bio:1,
          licenseNumber:1,
          expertiseTags: 1,
          status: 1,
          averageRating: "$rating.average",
          totalReviews: "$rating.count",
          completedSessions: 1,
          yearsOfExperience: 1,
          name: "$userDetails.name",
          email: "$userDetails.email",
          profileImage: "$userDetails.profileImage"
        }
      },

   
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limitNum }]
        }
      }
    ];

    const results = await Counsellor.aggregate(pipeline);

    const data = results[0]?.data || [];
    const total = results[0]?.metadata[0]?.total || 0;

    return response.status(200).json({
        statusCode: 200,
        success: true,
        error: [],
        message: "Filtered Counsellors",
        data: {
            counsellors: data,
            pagination: {
                total,
                page: parseInt(pageNum),
                totalPages: Math.ceil(total / limitNum),
                limit:parseInt(limit)
            }
        }
    });

  } catch (error) {
    return response.status(500).json({
        statusCode: 500,
        success: false,
        error: [
            {
                field: "popup",
                message: error?.message || "Internal Server Error"
            }
        ],
        message: ""
    });
  }
};