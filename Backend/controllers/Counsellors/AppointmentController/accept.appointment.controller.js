const Appointment = require("../../../models/Counsellors/appointment.model");
const { sendEmail } = require("../../../utils/System/send.email");
const { GetUserEmail } = require("../../../utils/User/get.user.id");
const LogController = require("../../System/logs/log.controller");
const AppointmentAcceptedEmailTemplate = require('../../../templates/appointment.accepted.template')

exports.AcceptStudentAppointmentController = async(request, response)=>{
    try {

        const { appointmentId } = request.params;
        const { meetingMethod, meetingLink, location, phoneNumber } = request.body;

        const counsellorName = request?.user?.name;

        request.body.email = GetUserEmail(request);

        const updatePayload = {
            status: "scheduled",
            meetingMethod
        };

        if (meetingMethod === "google-meet") {
            updatePayload.meetingDetails = meetingLink;
        } else if (meetingMethod === "in-person") {
            updatePayload.meetingDetails = location;
        } else if (meetingMethod === "phone") {
            updatePayload.meetingDetails = phoneNumber;
        }

        const appointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId, status: "pending" },
            updatePayload,
            { new: true }
        )
        .populate("student", "name email")

        if (!appointment) {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Appointment not found or already processed",
                    },
                ],
                message: "",
            });
        }

        const formattedDate = new Date(appointment.date).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const html = AppointmentAcceptedEmailTemplate(
            appointment.student.name,
            counsellorName,
            {
                date: formattedDate,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                meetingMethod,
                meetingLink,
                location,
                phoneNumber
            }
        );

        await sendEmail({
            to: appointment.student.email,
            subject: "Appointment Confirmed",
            html
        });

        await LogController(request, 'Appointment Accepted', 'success', 'Appointment accepted successfully');

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: "Appointment accepted successfully",
        });

        
    } catch (error) {
        await LogController(request, 'api::info', 'failed', error?.message);
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: 'popup',
                    message: error?.message
                }
            ],
            message: ''
        })
    }
}