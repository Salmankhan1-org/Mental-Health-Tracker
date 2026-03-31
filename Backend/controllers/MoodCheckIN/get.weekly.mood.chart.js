const MoodEntry = require("../../models/AI/mood.entry.schema")
const mongoose = require("mongoose");
const { GetUserId } = require("../../utils/User/get.user.id");
const redisClient = require("../../config/redis");

exports.GetWeeklyMoodChartController = async (request, response) => {
  try {
    const userId = GetUserId(request);

    const weeklyMoodChartRedisKey = `weekly-Mood-chart-data:${userId}`;

    const redisData = await redisClient.get(weeklyMoodChartRedisKey);

    if(redisData){
      return response.status(200).json({
        statusCode: 200,
        success: true,
        error: [],
        message: 'Weekly Mood Chart Data',
        data: JSON.parse(redisData)
      })
    }else{
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 6)
      startDate.setHours(0, 0, 0, 0)

      const entries = await MoodEntry.find({
        user: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }).sort({ createdAt: 1 })

      // Map entries by local day timestamp
      const entryMap = {}

      entries.forEach(entry => {
        const dayKey = new Date(
          entry.createdAt.getFullYear(),
          entry.createdAt.getMonth(),
          entry.createdAt.getDate()
        ).getTime()

        entryMap[dayKey] = entry
      })

      const result = []

      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)

        const key = date.getTime()
        const entry = entryMap[key]

        result.push({
          day: date.toLocaleDateString("en-US", { weekday: "short" }),
          mood: entry ? entry.analysis.moodScore : null,
          stress: entry ? entry.analysis.stressLevel : null
        })
      }

      await redisClient.set(weeklyMoodChartRedisKey, JSON.stringify(result),{EX:900});

      response.status(200).json({
        statusCode: 200,
        success: true,
        error: [],
        message: "Weekly Mood and Stress level Chart",
        data: result
      })
    }

  } catch (error) {
    response.status(500).json({
      statusCode: 500,
      success: false,
      error: [
        {
          field: "popup",
          message: error?.message
        }
      ],
      message: ''
    })
  }
}