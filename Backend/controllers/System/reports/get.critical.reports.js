const Report = require("../../../models/system/report.model")

exports.GetCriticalReportsController = async(request, response)=>{
    try {

        const criticalReports = await Report.find({
            severity: 'critical',
            status : {$ne:'resolved'}
        },
        {
            reportedBy:1,
            against: 1,
            severity: 1,
            reason: 1,
            description: 1

        }
        )
        .populate('reportedBy','name email')
        .populate('against','name email')
        .sort({createdAt: -1}).limit(5).lean()

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'Critical Reports',
            data: criticalReports
        });
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success : false,
            error:[
                {
                    field: 'popup',
                    message: error?.message || 'Internal Server Error'
                }
            ],
            message: ''
        })
    }
}