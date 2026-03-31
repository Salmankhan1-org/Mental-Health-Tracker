const Feedback = require("../../models/User/user.feedback.schema");
const { generateUsingAI } = require("../../utils/AI/gemini.ai");
const { GetFeedbackSentimentPrompt } = require("../../utils/Prompts/feedback.sentiment.prompt");
const { GetUserId, GetUserEmail } = require("../../utils/User/get.user.id");
const LogController = require("../System/logs/log.controller");

exports.UserFeedbackController = async(request, response)=>{
    try {

        const {rating, feedback} = request.body;
        const userId = GetUserId(request);
        request.body.email = GetUserEmail(request);
        

        if(rating < 0 && rating > 5){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    {
                        field: 'popup',
                        message: 'Rating should be between 1 and 5'
                    }
                ],
                message: ''
            })
        }

        if(rating && feedback){
            const FeedbackAIPrompt = GetFeedbackSentimentPrompt(feedback);

            const feedbackSentiment = await generateUsingAI(FeedbackAIPrompt);
            

            const newFeedback = await Feedback.create({user:userId, rating,feedback, sentiment:feedbackSentiment});

            if(newFeedback._id){
                await LogController(request, 'Feedback Submitted', 'success', 'A Feedback has been Submitted');
                return response.status(201).json({
                    statusCode: 201,
                    success: true,
                    error:[],
                    message: 'Feedback has been Submitted',
                    data:{}
                })
            }else{
                await LogController(request, 'api::info', 'failed', `Failed to create Feedback`)
                return response.status(203).json({
                    statusCode: 203,
                    success: false,
                    error: [
                        {
                            field: 'popup',
                            message: 'Failed to create Feedback'
                        }
                    ],
                    message: ''
                })
            }

        }else{
            response.status(401).json({
                statusCode: 401,
                success: false,
                error: [
                    {
                        field: 'popup',
                        message: 'Missing Rating or Feedback'
                    }
                ],
                message: ''
            })
        }
        
    } catch (error) {
        await LogController(request, 'api::info', 'failed', `${error?.message}`)
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