const MoodEntry = require("../../models/AI/mood.entry.schema")
const { generateUsingAI } = require("../../utils/AI/gemini.ai")
const { GenerateQuestionsPrompt } = require("../../utils/Prompts/generate.follow.up.questions")
const { GetUserId } = require("../../utils/User/get.user.id")

exports.StartMoodSessionController = async (request, response) => {
  try {
    const userId = GetUserId(request)
    const { mood, note } = request.body

    if (!mood || !note) {
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

    const Prompt = GenerateQuestionsPrompt(mood, note);

    const AIQuestions = await generateUsingAI(Prompt, true)

    const moodEntry = await MoodEntry.create({
        user: userId,
        selectedMood: mood,
        note,
        questionsAndAnswers: AIQuestions.map(q => ({
            question: q.question,
            options: q.options,
            answer: ""
        }))
    })

    return response.status(201).json({
        statusCode:201,
        success: true,
        error:[],
        message: "Mood session started",
        data: {
            moodEntryId: moodEntry._id,
            questions: moodEntry.questionsAndAnswers
        }
    })

  } catch (error) {
    return response.status(500).json({
        statusCode:500,
        success: false,
        error: [
            { 
                field: error?.field || 'server',
                message: error.message || 'Error while saving mood entry'
            }
        ],
        message: ''
    })
  }
}