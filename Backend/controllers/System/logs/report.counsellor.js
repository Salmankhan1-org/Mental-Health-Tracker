const Appointment = require("../../../models/Counsellors/appointment.model");
const Report = require("../../../models/system/report.model");

exports.CreateReportFromEmailController = async (req, res) => {
    try {
        const { appointmentId, userId } = req.reportUser;
        const { reason, description } = req.body;

        const appointment = await Appointment.findById(appointmentId)
            .populate('student counsellor');

        if (!appointment) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                error: [{ field: 'popup', message: 'Appointment not found' }],
                message: ''
            });
        }

        if (
            appointment.student._id.toString() !== userId &&
            appointment.counsellor._id.toString() !== userId
        ) {
            return res.status(403).json({
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
            return res.status(400).json({
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

        const against =
            appointment.student._id.toString() === userId
                ? appointment.counsellor._id
                : appointment.student._id;

        const report = await Report.create({
            appointment: appointmentId,
            reportedBy: userId,
            against,
            reason,
            description
        });

        return res.status(201).json({
            statusCode: 201,
            success: true,
            error: [],
            message: 'Report submitted successfully',
            data: report
        });

    } catch (error) {
        return res.status(500).json({
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