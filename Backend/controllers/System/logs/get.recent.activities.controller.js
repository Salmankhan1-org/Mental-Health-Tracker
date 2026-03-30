const Log = require("../../../models/system/log.model")

exports.GetRecentActivitiesController = async(request , response)=>{
    try {

        const recentActivities = await Log.find(
            {
                status:{$ne:'failed'},
                relation: {$ne: 'CRON'}
            },
            {
                relation:1,
                createdAt: 1
            }
        ).sort({createdAt:-1}).limit(5).lean();

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'Recent Activities',
            data: recentActivities
        })
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: 'popup',
                    message: error?.message || 'Internal Server Error'
                }
            ],
            message :''
        })
    }
}