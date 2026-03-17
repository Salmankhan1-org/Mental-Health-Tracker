const { request } = require("express");
const { GetUserId } = require("../../../utils/User/get.user.id");
const Counsellor = require("../../../models/Counsellors/counsellor.model");

exports.IsUserAlreadyAppliedForCounsellor = async(request, response)=>{
    try {

        const userId = GetUserId(request);

        const isAlreadyExist = await Counsellor.findOne({user:userId});

        if(isAlreadyExist._id){
            return response.status(200).json({
                statusCode: 200,
                success: true,
                error:[],
                message:'Already Exist',
                data: {
                    applied: 'applied',
                    status: isAlreadyExist.status
                }
            })
        }else{
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'popup',
                        message: 'Not Exist'
                    }
                ],
                message:''
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