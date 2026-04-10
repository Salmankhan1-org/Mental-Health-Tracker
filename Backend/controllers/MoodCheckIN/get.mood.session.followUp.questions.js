const MoodEntry = require("../../models/AI/mood.entry.schema");

exports.GetMoodSessionFollowUpQuestionsController = async(request, response)=>{
    try {

        const {moodEntryId} = request.params;

        const moodData = await MoodEntry.findById(moodEntryId);

        if(!moodData){
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'mood entry',
                        message: 'Mood Entry not Found'
                    }
                ],
                message:''
            })
        }


        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'Mood Entry Follow up questions',
            data: moodData.questionsAndAnswers
        })
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: error?.field || 'server',
                    message: error?.message || 'Error while getting follow up questions'
                }
            ],
            message: ''
        })
    }
}