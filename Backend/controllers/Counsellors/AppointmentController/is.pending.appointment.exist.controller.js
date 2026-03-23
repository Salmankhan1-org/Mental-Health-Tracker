const Appointment = require("../../../models/Counsellors/appointment.model");
const { GetUserId } = require("../../../utils/User/get.user.id")

exports.CheckIfPendingAppointmentExist = async(request, response)=>{
    try {

        const counsellorId = GetUserId(request);

        const pendingAppointments = await Appointment.find({
            counsellor: counsellorId,
            status: 'pending'
        });

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'Pending Appointments Exist',
            data: pendingAppointments
        })
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: true,
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