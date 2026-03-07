const redisClient = require("../../config/redis");
const MoodEntry = require("../../models/mood.entry.schema");
const { GetUserId } = require("../../utils/User/get.user.id")
const mongoose = require('mongoose');

exports.GetWeeklyUserMoodStats = async(request, response) =>{
    try {


        const userId = GetUserId(request);
        const redisKey = `weekly-mood-stats:${userId}`;

        // Check if redis contains the data

        const redisData = await redisClient.get(redisKey);

        if(redisData){

            return response.status(200).json({
                statusCode: 200,
                success: true,
                error:[],
                message: "Weekly Mood Stats Data",
                data: JSON.parse(redisData)
            })

        }else{
            const now = new Date()

            const startOfThisWeek = new Date(now)
            startOfThisWeek.setDate(now.getDate() - now.getDay())
            startOfThisWeek.setHours(0, 0, 0, 0)

            const startOfLastWeek = new Date(startOfThisWeek)
            startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

            const endOfLastWeek = new Date(startOfThisWeek)
            endOfLastWeek.setMilliseconds(-1)

            //  Aggregate This Week
            const thisWeek = await MoodEntry.aggregate([
            {
                $match: {
                user: new mongoose.Types.ObjectId(userId),
                createdAt: { $gte: startOfThisWeek }
                }
            },
            {
                $group: {
                _id: null,
                avgMood: { $avg: "$analysis.moodScore" },
                avgStress: { $avg: "$analysis.stressLevel" },
                avgBalance: { $avg: "$analysis.emotionalBalanceScore" }
                }
            }
            ])

            //  Aggregate Last Week
            const lastWeek = await MoodEntry.aggregate([
            {
                $match: {
                user: new mongoose.Types.ObjectId(userId),
                createdAt: {
                    $gte: startOfLastWeek,
                    $lte: endOfLastWeek
                }
                }
            },
            {
                $group: {
                _id: null,
                avgMood: { $avg: "$analysis.moodScore" },
                avgStress: { $avg: "$analysis.stressLevel" },
                avgBalance: { $avg: "$analysis.emotionalBalanceScore" }
                }
            }
            ])

            const current = thisWeek[0] || {}
            const previous = lastWeek[0] || {}

            //  Calculate percentage difference
            const calculateChange = (currentValue, prevValue) => {
                if (!prevValue || prevValue === 0) return null

                return Number(
                    (((currentValue - prevValue) / prevValue) * 100).toFixed(1)
                )
            }

            const emotionalChange = calculateChange(
                current.avgBalance,
                previous.avgBalance
            )

            const stressChange = calculateChange(
                previous.avgStress,  // reversed because lower stress is better
                current.avgStress
            )

            //  Overall score formula
            const overallScore = Math.round(
                (current.avgBalance || 0) * 0.5 +
                (current.avgMood || 0) * 10 * 0.3 +
                (5 - (current.avgStress || 0)) * 20 * 0.2
            )

            const responseData = {
                overall: overallScore,
                improving: overallScore > 50,
                emotionalBalance: Math.round(current.avgBalance || 0),
                emotionalChange: emotionalChange ?? null,
                stressChange: stressChange ?? null,
            }

            // Save in redis for cache
            await redisClient.set(redisKey,JSON.stringify(responseData),{EX:900});


            response.status(200).json({
                statusCode: 200,
                success: true,
                error:[],
                message: "Weekly Mood Stats",
                data: responseData
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