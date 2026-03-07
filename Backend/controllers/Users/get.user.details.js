exports.GetUserDetailsController = async(request, response) =>{
    try {

        const user = request.user;

        if(user){
            response.status(200).json({
                statusCode: 200,
                success: true,
                error:[],
                message: "User Details Fetched Successfully",
                data: user
            })
        }else{
            response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: "popup",
                        message: "User not Found"
                    }
                ],
                message: ""
            })
        }
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "Error in Fetching User Details"
                }
            ],
            message: ""
        })
    }
}