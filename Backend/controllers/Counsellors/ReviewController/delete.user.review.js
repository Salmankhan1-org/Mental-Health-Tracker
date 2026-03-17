const CounsellorReview = require("../../../models/Counsellors/review.model");
const { GetCounsellorId } = require("../../../utils/Counsellors/get.counselor.id");
const { GetUserId } = require("../../../utils/User/get.user.id")

exports.DeleteUserReviewController = async(request,response) =>{
    try {

        const userId = GetUserId(request);
        const {reviewId} = request.params;
        const counsellorId = GetCounsellorId(request);

        if(reviewId){

            await CounsellorReview.findOneAndDelete({user:userId, _id: reviewId, counsellor:counsellorId});

            response.status(200).json({
                statusCode: 200,
                success: true,
                error:[],
                message: 'Review Deleted Successfully',
                data: []
            });

        }else{
            response.status(401).json({
                statusCode: 401,
                success: true,
                error: [
                    {
                        field : 'popup',
                        message: 'Review Id not provided'
                    }
                ]
            })
        }
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: true,
            error: [
                {
                    field : 'popup',
                    message: error?.message
                }
            ]
        })
    }
}