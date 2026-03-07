const DailyWellnessTip = require("../../models/daily.wellness.tip.model");
const MoodEntry = require("../../models/mood.entry.schema");
const { generateUsingAI } = require("../../utils/AI/gemini.ai");
const { GetWellnessTipPrompt } = require("../../utils/Prompts/wellness.tip.prompt");
const { GetUserId, GetUserEmail } = require("../../utils/User/get.user.id");
const LogController = require("../System/logs/log.controller");

exports.GenerateDailyWellnessTip = async(request, response)=>{
    try {

        const userId = GetUserId(request);
        if(!request.body){
            request.body = {};
        }
        request.body.email = GetUserEmail(request);

        const today = new Date().toISOString().split("T")[0];

        const existingWellnessTip = await DailyWellnessTip.findOne({
            user: userId,
            date: today
        });

        if(!existingWellnessTip){

            // Find recent mental state data
            const RecentMentalState = await MoodEntry.findOne({
                user: userId
            }).sort({createdAt: -1});

            if(RecentMentalState){

               const {moodScore, stressLevel, sentiment} = RecentMentalState.analysis;

               const CustomPrompt = GetWellnessTipPrompt(moodScore, stressLevel, sentiment);

               // Generate wellness tip using AI
               const DailyWellnessTipUsingAI = await generateUsingAI(CustomPrompt);

               if(DailyWellnessTipUsingAI){

                const contextSnapshot = {
                    moodScore,
                    stressLevel,
                    sentiment
                }

                const DailyTip = await DailyWellnessTip.create({
                    user: userId,
                    tip: DailyWellnessTipUsingAI,
                    date: today,
                    contextSnapshot
                })

                await LogController(request, "Wellness Tip", "success", "Daily Wellness TIp Generated")

                return response.status(201).json({
                    statusCode: 201,
                    success: true,
                    error:[],
                    message: 'Daily Wellness Tip Generated',
                    data: DailyTip
                })

               }else{
                    return response.status(303).json({
                        statusCode: 303,
                        success: false,
                        error:[
                            {
                                field: 'popup',
                                message: "Failed to Generate Wellness TIp"
                            }
                        ],
                        message: '',
                    
                    })
               }

            }else{
                return response.status(404).json({
                    statusCode: 404,
                    success: false,
                    error:[
                        {
                            field: 'popup',
                            message: "No Mental Data exist"
                        }
                    ],
                    message: '',
                  
                })
            }

        }else{

            return response.status(200).json({
                statusCode: 200,
                success: true,
                error:[],
                message: 'Already exist today wellness tip',
                data: existingWellnessTip.tip
            })
        }

        
        
    } catch (error) {
        await LogController(request, "api:info","failed",`${error?.message}`)
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