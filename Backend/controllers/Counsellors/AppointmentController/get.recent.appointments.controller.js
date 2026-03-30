const Appointment = require("../../../models/Counsellors/appointment.model");

exports.GetRecentAppointmentsController = async (request, response) => {
    try {

        const appointments = await Appointment.find(
        {
            isDeleted: { $ne: true } 
        },
        {
            counsellor: 1,
            student: 1,
            date: 1,
            startTime: 1,
            endTime: 1,
            status: 1,
            createdAt: 1
        }
        )
        .populate({
            path: "counsellor",
            select: "name email"
        })
        .populate({
            path: "student",
            select: "name email"
        })
        .sort({ createdAt: -1 }) 
        .limit(5)
        .lean();

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: "Recent Appointments",
            data: appointments
        });

    } catch (error) {
        return response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: error?.message || "Internal Server Error"
                }
            ],
            message: ""
        });
    }
};