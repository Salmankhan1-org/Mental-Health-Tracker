const { GuidanceQueue } = require("../../config/generate.quidance.queue");
const redisClient = require("../../config/redis");
const MoodEntry = require("../../models/AI/mood.entry.schema");
const { generateUsingAI } = require("../../utils/AI/gemini.ai");
const { MoodCheckInPrompt } = require("../../utils/Prompts/mood.checkin.prompt");
const { GetUserId } = require("../../utils/User/get.user.id");
const LogController = require("../System/logs/log.controller");

exports.MoodCheckInController = async(request, response ) => {
    try {

        const userId = GetUserId(request);
        request.body.email = request.user?.email

        const {mood, note} = request.body;


        const CheckInPrompt = MoodCheckInPrompt(mood,note);

        if(mood && note){

            const AIResponse = await generateUsingAI(CheckInPrompt, true);

            
            if(AIResponse){

                const analysis = {
                    moodScore: AIResponse.moodScore,
                    stressLevel: AIResponse.stressLevel,
                    sentiment: AIResponse.sentiment,
                    detectedEmotions: AIResponse.detectedEmotions,
                    emotionalBalanceScore: AIResponse?.emotionalBalanceScore,
                    insight : AIResponse.insight,
                    confidence : AIResponse.confidence
                }

                // Create a Database entry
                const moodEntry = await MoodEntry.create({
                    user: userId,
                    selectedMood: mood,
                    note,
                    analysis
                })

                // Offer Tailored Guidance to user based on Mood Status
                await GuidanceQueue.add('generate-guidance', {
                    userId,
                    moodEntryId: moodEntry._id
                });

                await LogController(request, `Mood Checked In by ${request?.user?.name}`, "success", `Logged Mood. Feeling ${moodEntry.selectedMood}`);

                // Delete weekly Mood stats Data from redis
                const weeklyMoodStatsRedisKey = `weekly-mood-stats:${userId}`;
                const weeklySentimentRedisKey = `weekly-sentiment-data:${userId}`;
                const weeklyMoodChartRedisKey = `weekly-Mood-chart-data:${userId}`;
                await redisClient.del(weeklyMoodStatsRedisKey);
                await redisClient.del(weeklySentimentRedisKey);
                await redisClient.del(weeklyMoodChartRedisKey);

                response.status(201).json({
                    statusCode: 201,
                    success: true,
                    error:[],
                    message: "Mood Checked in Successfully",
                    data: []
                })

            }else{
                await LogController(request, "api:AI Response", "failed", "Error in AI Response");
                response.status(401).json({
                    statusCode: 401,
                    success: false,
                    error:[
                        {
                            field: "popup",
                            message: "Error in Ai response" || error?.message
                        }
                    ],
                    message: ''
                })
            }

        }else{
            await LogController(request, "api:info", "failed", "Missing Required Fields");
            response.status(400).json({
                statusCode: 400,
                success : false,
                error:[
                    {
                        field: "popup",
                        message: "Missing required fields"
                    }
                ],
                message:''
            })
        }
        
    } catch (error) {
        await LogController(request, "api:mood-check-in", "failed", "Failed to detect mood");
        response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "Failed to detect mood"||error?.message
                }
            ],
            message: ''
        })
    }
}