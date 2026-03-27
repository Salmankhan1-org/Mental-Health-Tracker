const Appointment = require("../../../models/Counsellors/appointment.model");
const Report = require("../../../models/system/report.model");
const { GetSeverity } = require("../../../utils/AI/get.severity");

exports.CreateReportFromEmailController = async (request, response) => {
    try {
        const { appointmentId, userId } = request;
        const { reason, description } = request.body;

        const appointment = await Appointment.findById(appointmentId)
            .populate('student counsellor');

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

        if (
            appointment.student._id.toString() !== userId &&
            appointment.counsellor._id.toString() !== userId
        ) {
            return response.status(403).json({
                statusCode: 403,
                success: false,
                error: [
                    { 
                        field: 'popup', 
                        message: 'Unauthorized' 
                    }
                ],
                message: ''
            });
        }

        const alreadyReported = await Report.findOne({
            appointment: appointmentId,
            reportedBy: userId
        });

        if (alreadyReported) {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    { 
                        field: 'popup', 
                        message: 'You have already reported this appointment' 
                    }
                ],
                message: ''
            });
        }
        // Auto detect severity of report using AI
        const severity = await GetSeverity(reason, description);

        const against =
            appointment.student._id.toString() === userId
                ? appointment.counsellor._id
                : appointment.student._id;

        const report = await Report.create({
            appointment: appointmentId,
            reportedBy: userId,
            against,
            reason,
            description,
            severity
        });

        return response.status(201).json({
            statusCode: 201,
            success: true,
            error: [],
            message: 'Report submitted successfully',
            data: report
        });

    } catch (error) {
        return response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                { 
                    field: 'popup', 
                    message: error.message 
                }
            ],
            message: ''
        });
    }
};