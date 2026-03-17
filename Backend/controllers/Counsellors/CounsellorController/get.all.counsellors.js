const Counsellor = require("../../../models/Counsellors/counsellor.model")

exports.GetAllCounsellorsController = async(request,response)=>{
    try {

        const counsellors = await Counsellor.find({}).populate("user","name profileImage").sort({createdAt: -1});

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: 'All Counsellors',
            data: counsellors
        })
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: true,
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