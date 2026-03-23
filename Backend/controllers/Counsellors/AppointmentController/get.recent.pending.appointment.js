const Appointment = require("../../../models/Counsellors/appointment.model");
const { GetUserId } = require("../../../utils/User/get.user.id");

exports.GetRecentPendingAppointmentsController = async (request, response) => {
    try {
        const userId = GetUserId(request);

        const pendingRequests = await Appointment.find({
            counsellor: userId,
            status: "pending"
        })
        .populate("student", "name email")
        .sort({ createdAt: -1 })
        .limit(5);

        response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: "Recent pending requests fetched",
            data: pendingRequests
        });
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
            message: ""
        });
    }
};