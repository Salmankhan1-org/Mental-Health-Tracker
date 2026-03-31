const MoodEntry = require("../../models/AI/mood.entry.schema")
const mongoose = require('mongoose');
const { GetUserId } = require("../../utils/User/get.user.id");
const redisClient = require("../../config/redis");

exports.GetWeeklySentimentController = async (request, response) => {
  try {
    const userId = GetUserId(request);

    const redisKey = `weekly-sentiment-data:${userId}`;
    const redisData = await redisClient.get(redisKey);

    if(redisData){

      return response.status(200).json({
        statusCode: 200,
        success: true,
        error:[],
        message: 'Weekly Sentiment Data',
        data: JSON.parse(redisData)
      })

    }else{

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 6)
      startDate.setHours(0, 0, 0, 0)

      const result = await MoodEntry.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: "$analysis.sentiment",
            count: { $sum: 1 }
          }
        }
      ])

      let positive = 0
      let neutral = 0
      let negative = 0

      result.forEach(item => {
        if (item._id === "positive") positive = item.count
        if (item._id === "neutral") neutral = item.count
        if (item._id === "negative") negative = item.count
      })

      const total = positive + neutral + negative || 1

      const sentimentData = [
        {
          name: "Positive",
          value: Math.round((positive / total) * 100),
          color:  "var(--color-chart-1)"
        },
        {
          name: "Neutral",
          value: Math.round((neutral / total) * 100),
          color: "var(--color-chart-4)"
        },
        {
          name: "Negative",
          value: Math.round((negative / total) * 100),
          color: "var(--color-chart-5)"
        }
      ]

      // save data in redis to cache
      await redisClient.set(redisKey, JSON.stringify(sentimentData),{EX:900});

      response.status(200).json({
          statusCode: 200,
          success: true,
          error:[],
          message: "Weekly sentiment data",
          data: sentimentData
      })

    }

    

  } catch (error) {
    response.status(500).json({
        statusCode: 500,
        success: false,
        error: [
            {
                field: 'popup',
                message: error?.message
            }
        ],
        message: ''
    })
  }
}