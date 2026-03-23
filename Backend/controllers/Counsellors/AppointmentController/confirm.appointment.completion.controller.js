const Appointment = require("../../../models/Counsellors/appointment.model");

exports.ConfirmAppointmentCompletionController = async (request, response) => {
    try {
        const { appointmentId, userId } = request;

        const appointment = await Appointment.findOne({
            _id: appointmentId,
            student: userId
        });

        if (!appointment) {
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error: [
                    { 
                        field: 'popup', 
                        message: 'Appointment not found' 
                    }
                ],
                message: ''
            });
        }

        if (appointment.status === 'completed') {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    { 
                        field: 'popup', 
                        message: 'Appointment already completed' 
                    }
                ],
                message: ''
            });
        }

        if (appointment.status !== 'completed_by_counsellor') {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    { 
                        field: 'popup', 
                        message: 'Invalid appointment state' 
                    }
                ],
                message: ''
            });
        }

        appointment.status = 'completed';
        appointment.completedConfirmedAt = new Date();

        await appointment.save();

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: 'Appointment successfully marked as completed',
            data: null
        });

    } catch (error) {
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