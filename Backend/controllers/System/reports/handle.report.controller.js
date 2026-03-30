const Report = require("../../../models/system/report.model");
const { GetUserId, GetUserEmail } = require("../../../utils/User/get.user.id");
const LogController = require("../logs/log.controller");

exports.HandleReportController = async(request, response)=>{
    try {

        const { status, notes } = request.body;
        const { reportId } = request.params;

        const userId = GetUserId(request);

        request.body.email = GetUserEmail(request);

        if(!['open', 'in_review', 'resolved', 'rejected'].includes(status)){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'popup',
                        message: 'Invalid Status Provided'
                    }
                ],
                message: ''
            })
        }

        const updateData = {
            status: status,
            resolutionNote: notes,
            handledBy: userId
        };

        if (['resolved', 'rejected'].includes(status)) {
            updateData.resolvedAt = new Date();
        }

        const report = await Report.findOneAndUpdate(
            { _id: reportId },
            updateData,
            { returnDocument: 'after' }
        );

        if(!report){
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'popup',
                        message: 'Report Not Found'
                    }
                ],
                message: ''
            })
        }

        // if resolved or reject then notify user about their report status

        await LogController(request, 'Report Processed', 'success',  `Report has been ${status} successfully`)

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: `Report has been ${status} successfully`
        })
        
    } catch (error) {
        await LogController(request, 'report-handled', 'failed',  error?.message)

        response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: 'popup',
                    message: error?.message || 'Internal Server error'
                }
            ],
            message: ''
        })
    }
}