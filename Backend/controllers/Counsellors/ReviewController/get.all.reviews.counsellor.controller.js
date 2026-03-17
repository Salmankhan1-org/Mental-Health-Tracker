const CounsellorReview = require("../../../models/Counsellors/review.model");
const { GetCounsellorId } = require("../../../utils/Counsellors/get.counselor.id")

exports.GetAllReviewsOfACounsellorController = async(request,response)=>{
    try {

        const CounsellorId = GetCounsellorId(request);
        
        const reviews = await CounsellorReview.find({counsellor: CounsellorId}).populate('user','name profileImage').sort({createdAt:-1});

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'All Reviews',
            data: reviews
        })
        
    } catch (error) {
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