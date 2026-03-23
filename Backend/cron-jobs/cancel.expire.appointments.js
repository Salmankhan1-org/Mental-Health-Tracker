const cron = require('node-cron');
const Appointment = require('../models/Counsellors/appointment.model');
const { sendEmail } = require('../utils/System/send.email');
const AppointmentCancelledEmailTemplate = require('../templates/appointment.cancelled.template');
const LogController = require('../controllers/System/logs/log.controller');

let isRunning = false;

exports.CancelExpiredAppointments = () => {
    cron.schedule('*/5 * * * *', async () => {
        if (isRunning) return;

        isRunning = true;

        try {
            const now = new Date();
            const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000);
            const twoHoursAgo = new Date(now.getTime() - 120 * 60 * 1000);
            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

            const expiredAppointments = await Appointment.find({
                status: 'pending',
                $or: [
                { date: { $lte: oneHourFromNow }, createdAt: { $lt: fifteenMinsAgo } },
                { date: { $gt: oneHourFromNow }, createdAt: { $lt: twoHoursAgo } }
                ]
            })
                .select('_id student counsellor')
                .populate('student counsellor', 'name email')
                .limit(50); // prevent overload

            if (expiredAppointments.length === 0) return;

            const ids = expiredAppointments.map(app => app._id);

            //  Bulk update (instead of saving one by one)
            await Appointment.updateMany(
                { _id: { $in: ids } },
                { $set: { status: 'cancelled' } }
            );

            //  Parallel email sending
            await Promise.all(
                expiredAppointments.map(app => {
                    const html = AppointmentCancelledEmailTemplate(
                        app.student.name,
                        app.counsellor.name,
                        {
                        reason: "No response from counsellor within the required time.",
                        cancelledBy: 'system'
                        }
                    );

                    return sendEmail({
                        to: app.student.email,
                        subject: 'Appointment Request Expired',
                        html
                    });
                })
            );

            LogController(
                { email: "system@mindbridge.com" },
                'CRON',
                'success',
                `Processed ${expiredAppointments.length} expired appointments`
            );

            console.log(`[Cron] Processed ${expiredAppointments.length} expired requests.`);
        } catch (error) {
            console.error('[Cron Error]:', error);
        } finally {
            isRunning = false;
        }
    });
};