// Is User Already checked in today or not

const MoodEntry = require("../../models/mood.entry.schema");
const { GetUserId } = require("../../utils/User/get.user.id")

exports.IsUserAlreadyCheckedInTodayController = async(request, response)=>{
    try {

        const userId = GetUserId(request);

        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        const IsAlreadyCheckedIn = await MoodEntry.findOne({
            user: userId,
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })

        if(IsAlreadyCheckedIn){
            response.status(200).json({
                statusCode: 200,
                success: true,
                error:[],
                message: "Already Checked In",
                data: IsAlreadyCheckedIn
            })
        }else{
            response.status(200).json({
                statusCode: 200,
                success: false,
                error:[],
                message: "Not Checked In",
                data: IsAlreadyCheckedIn
            })
        }
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: "poppup",
                    message: error?.message
                }
            ],
            message: ''
        })
    }
}