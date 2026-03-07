const Feedback = require("../../models/user.feedback.schema")

exports.GetUsersFeedbacks = async(request, response)=>{
    try {

        const feedbacks = await Feedback.find({sentiment:'positive', rating:{$gte:4}})
                            .sort({createdAt:-1})
                            .limit(10).
                            populate('user','name role profileImage');

        response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: 'Users Feedbacks Fetched ',
            data: feedbacks
        })
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: 'popup',
                    error: error?.message
                }
            ],
            message: ''
        })
    }
}