const Counsellor = require("../../../models/Counsellors/counsellor.model");
const { GetCounsellorId } = require("../../../utils/Counsellors/get.counselor.id")

exports.GetSingleCounsellorController = async(request,response)=>{
    try {

        const CounsellorId = GetCounsellorId(request);

        const counsellor = await Counsellor.findById(CounsellorId).populate('user','name profileImage');

        if(counsellor._id){
            return response.status(200).json({
                statusCode: 200,
                success: true,
                error: [],
                message: 'Single Counsellor Data',
                data: counsellor
            })
        }else{

            response.status(404).json({
                statusCode: 404,
                success: false,
                error: [
                    {
                        field: 'popup',
                        message: 'Counsellor Not Found'
                    }
                ],
                message: ''
            })
        }
        
    } catch (error) {
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