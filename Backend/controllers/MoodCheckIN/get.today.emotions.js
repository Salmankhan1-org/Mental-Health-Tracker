const MoodEntry = require("../../models/mood.entry.schema")
const mongoose = require('mongoose');
const { GetUserId } = require("../../utils/User/get.user.id");

exports.GetTodayEmotionsController = async (request, response) => {
  try {
    const userId = GetUserId(request);

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const entry = await MoodEntry.findOne({
      user: new mongoose.Types.ObjectId(userId),
      createdAt: { $gte: today }
    })

    response.status(200).json({
        statusCode: 200,
        success: true,
        error:[],
        message: 'Recent Detected Emotions',
        data: entry?.analysis.detectedEmotions || []
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