const User = require("../../models/User/userModel");

exports.DeleteUserByAdminController = async (request, response) => {
    try {
        const userId = request.params?.userId;

        const user = await User.findOneAndUpdate(
            { _id: userId, isDeleted: false },
            { isDeleted: true },
            { returnDocument: 'after' } // return updated document
        );

        if (!user) {
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error: [
                    {
                        field: 'popup',
                        message: 'User not Found'
                    }
                ],
                message: ''
            });
        }

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: 'User Deleted Successfully'
        });

    } catch (error) {
        return response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: 'popup',
                    message: error?.message || 'Internal Server Error'
                }
            ],
            message: ''
        });
    }
}