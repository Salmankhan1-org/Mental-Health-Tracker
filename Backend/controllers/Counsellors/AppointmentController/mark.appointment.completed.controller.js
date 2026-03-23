const Appointment = require("../../../models/Counsellors/appointment.model");
const { sendEmail } = require("../../../utils/System/send.email");
const { GetUserId } = require("../../../utils/User/get.user.id");
const AppointmentCompletionConfirmationTemplate = require("../../../templates/appointment.confirm.email.template");
const jwt = require('jsonwebtoken');

exports.MarkAppointmentCompletedController = async (request, response) => {
    try {
        const userId = GetUserId(request);
        const { appointmentId } = request.params;

        const counsellorName = request?.user.name;

        const appointment = await Appointment.findById(appointmentId)
            .populate("student", "name email")
           
        if (!appointment) {
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Appointment not found"
                    }
                ],
                message: ""
            });
        }

        if (appointment.counsellor._id.toString() !== userId.toString()) {
            return response.status(403).json({
                statusCode: 403,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Unauthorized action"
                    }
                ],
                message: ""
            });
        }

        if (appointment.status !== "scheduled") {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Only scheduled appointments can be marked as completed"
                    }
                ],
                message: ""
            });
        }

        appointment.status = "completed_by_counsellor";
        appointment.completedAt = new Date();
        appointment.confirmationDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await appointment.save();

        // Create a token to create link for email
        const appointmentToken = jwt.sign(
            {
                appointmentId: appointment._id,
                userId: appointment.student._id,
                action: 'confirm_appointment'
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '24h' }
        );

        const html = AppointmentCompletionConfirmationTemplate(
            appointment.student.name,
            counsellorName,
            appointment.date,
            {
                meetingMethod: appointment.meetingMethod,
                meetingLink: appointment.meetingDetails,
                location: appointment.meetingDetails,
                phoneNumber: appointment.meetingDetails,
                appointmentToken
            }
        );

        await sendEmail({
            to: appointment.student.email,
            subject: "Confirm Your Session Completion",
            html
        });

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: "Appointment marked as completed. Awaiting student confirmation.",
            data: null
        });

    } catch (error) {
        return response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: error?.message
                }
            ],
            message: ""
        });
    }
};