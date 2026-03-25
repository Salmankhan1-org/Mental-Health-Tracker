const Counsellor = require("../../../models/Counsellors/counsellor.model");

exports.UpdateCounsellorStatusController = async(request,response)=>{
    try {

        let statusInput = request.body.status || request.query.status;
        const {counsellorId} = request.params;

        const status = statusInput?.trim().toLowerCase();

        const allowedStatus = ['pending','approved','rejected'];

        if(!allowedStatus.includes(status)){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'popup',
                        message: 'Invalid status Provided'
                    }
                ],
                message: ''
            })
        }

        const counsellor = await Counsellor.findOneAndUpdate(
            {_id: counsellorId},
            {status: status},
            {returnDocument: 'after'}
        );

        if(!counsellor){
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'popup',
                        message: 'Counsellor not Found'
                    }
                ],
                message: ''
            })
        }

        {/*
            ** Notify User That their Application is either rejected or approved
        */}

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: `Counsellor ${statusInput} Successfully` 
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