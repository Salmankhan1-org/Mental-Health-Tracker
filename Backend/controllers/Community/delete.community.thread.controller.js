const Thread = require("../../models/Community/community.thread.model");

exports.DeleteCommunityThreadController = async (request, response)=>{
    try {

        const {threadId} = request.params;

        if(!threadId){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field:  'thread id',
                        message: 'Thread id not provided'
                    }
                ],
                message: ''
            })
        }

        const thread = await Thread.findByIdAndDelete(threadId);

        if(!thread){
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field:  'Thread',
                        message: 'Thread not found'
                    }
                ],
                message: ''
            })
        }


        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'Thread Deleted Successfully'
        });
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: error?.field || 'server',
                    message: error?.message || 'Error while deleting thread'
                }
            ],
            message: ''
        })
    }
}