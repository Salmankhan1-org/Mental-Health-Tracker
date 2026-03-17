const mongoose = require("mongoose");
const CounsellorReview = require("../../../models/Counsellors/review.model");
const { GetCounsellorId } = require("../../../utils/Counsellors/get.counselor.id");

exports.GetCounsellorReviewStats = async (request, response) => {
  try {
    const counsellorId = GetCounsellorId(request);

    const stats = await CounsellorReview.aggregate([
      {
        $match: {
          counsellor: new mongoose.Types.ObjectId(counsellorId)
        }
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      }
    ])

    const totalReviews = stats.reduce((acc, item) => acc + item.count, 0)

    const ratingMap = { 1:0, 2:0, 3:0, 4:0, 5:0 }

    stats.forEach(item => {
      ratingMap[item._id] = item.count
    })

    const distribution = Object.keys(ratingMap)
      .map(Number)
      .reverse()
      .map(rating => ({
        rating,
        count: ratingMap[rating],
        percentage: totalReviews
          ? Math.round((ratingMap[rating] / totalReviews) * 100)
          : 0
      }))

    const averageData = await CounsellorReview.aggregate([
      {
        $match: {
          counsellor: new mongoose.Types.ObjectId(counsellorId)
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" }
        }
      }
    ])

    const averageRating = averageData[0]?.averageRating || 0

    return response.status(200).json({
        statusCode: 200,
        success: true,
        error:[],
        message: 'Counsellor Review Stats',
        data: {
            averageRating: Number(averageRating.toFixed(1)),
            totalReviews,
            distribution
        }
    })

  } catch (error) {
    response.status(500).json({
        statusCode: 500,
        success: false,
        error:[
            {
                field: 'popup',
                message: error?.message
            }
        ],
        message: ''
    })
  }
}