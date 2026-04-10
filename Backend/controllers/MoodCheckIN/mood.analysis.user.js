const { GuidanceQueue } = require("../../config/generate.quidance.queue")
const redisClient = require("../../config/redis")
const MoodEntry = require("../../models/AI/mood.entry.schema")
const { generateUsingAI } = require("../../utils/AI/gemini.ai")
const { GetUserId, GetUserEmail } = require("../../utils/User/get.user.id")
const {MoodCheckInPrompt} = require('../../utils/Prompts/mood.checkin.prompt');
const LogController = require("../System/logs/log.controller")

exports.CompleteMoodSessionController = async (request, response) => {
    try {
        const userId = GetUserId(request)
        const { moodEntryId, answers } = request.body

        request.body.email = GetUserEmail(reuqest);

        if (!moodEntryId || !Array.isArray(answers)) {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    { 
                        field: 'data',
                        message: "Invalid request data" 
                    }
                ],
                message: ''
            })
        }

        //  Fetch mood entry
        const moodEntry = await MoodEntry.findOne({
            _id: moodEntryId,
            user: userId
        })

        if (!moodEntry) {
            return response.status(404).json({
                statusCode:404,
                success: false,
                error: [
                    {
                        field: 'mood entry',
                        message: "Mood session not found" 
                    }
                ],
                message: ''
            })
        }

        const questions = moodEntry.questionsAndAnswers || []

        //  Map answers to questions
        if (answers.length !== questions.length) {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    { 
                        field: 'data',
                        message: "Answers count mismatch" 
                    }
                ],
                message: ''
            })
        }

        const updatedQA = questions.map((q, index) => ({
            question: q.question,
            options: q.options,
            answer: answers[index]
        }))

        //  Save answers
        moodEntry.questionsAndAnswers = updatedQA

        //  Generate AI prompt
        const prompt = MoodCheckInPrompt(
            moodEntry.selectedMood,
            moodEntry.note,
            updatedQA
        )

        //  Run AI
        const AIResponse = await generateUsingAI(prompt, true)

        if (!AIResponse) {
         throw new Error("AI response failed")
        }

        //  Save analysis
        moodEntry.analysis = {
            moodScore: AIResponse.moodScore,
            stressLevel: AIResponse.stressLevel,
            sentiment: AIResponse.sentiment,
            detectedEmotions: AIResponse.detectedEmotions,
            emotionalBalanceScore: AIResponse.emotionalBalanceScore,
            insight: AIResponse.insight,
            confidence: AIResponse.confidence
        }

        moodEntry.sessionStatus = "completed"

        await moodEntry.save()

        //  Queue guidance
        await GuidanceQueue.add("generate-guidance", {
        userId,
        moodEntryId: moodEntry._id
        })

        //  Clear Redis cache
        await redisClient.del(`weekly-mood-stats:${userId}`)
        await redisClient.del(`weekly-sentiment-data:${userId}`)
        await redisClient.del(`weekly-Mood-chart-data:${userId}`)

        await LogController(request, "api:mood-check-in", "failed", "Failed to detect mood");

        return response.status(201).json({
            statusCode: 201,
            success: true,
            error:[],
            message: "Mood session completed successfully",
        })

    } catch (error) {
        await LogController(request, "api:mood-check-in", "failed", "Failed to detect mood");
        return response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                { 
                    field: error?.field || 'mood entry',
                    message: error?.message || 'Error while analyzing mood entry' 
                }
            ],
            message: ''
        })
    }
}