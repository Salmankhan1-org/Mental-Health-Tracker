const Appointment = require("../../../models/Counsellors/appointment.model");
const { sendEmail } = require("../../../utils/System/send.email");
const AppointmentCancelledEmailTemplate = require('../../../templates/appointment.cancelled.template');
const LogController = require("../../System/logs/log.controller");
const { GetUserEmail } = require("../../../utils/User/get.user.id");

exports.RejectStudentAppointmentController = async (request, response) => {
    try {
        const { appointmentId } = request.params;

        if(!request.body){
            request.body = {}
        }

        request.body.email = GetUserEmail(request);
        const counsellorName = request?.user?.name;

        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: appointmentId,
                status: 'pending'
            },
            {
                status: 'cancelled'
            },
            { new: true }
        )
            .populate('student', 'name email')
         
        if (!appointment) {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    {
                        field: 'popup',
                        message: 'Appointment already processed or not found'
                    }
                ],
                message: ''
            });
        }

        const html = AppointmentCancelledEmailTemplate(
        appointment.student.name,
        counsellorName,
            {
                reason: "Your appointment has been cancelled by Counsellor",
                cancelledBy: 'Counsellor'
            }
        );

        await sendEmail({
            to: appointment.student.email,
            subject: 'Appointment Cancelled',
            html
        });

        await LogController(request,'Appointment Cancelled','success','Expired appointment processed')

    return response.status(200).json({
        statusCode: 200,
        success: true,
        error: [],
        message: 'Appointment cancelled successfully'
    });

    } catch (error) {
        await LogController(request,'api::info','failed',error?.message)
        return response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: 'popup',
                    message: error?.message
                }
            ],
            message: ''
        });
    }
};