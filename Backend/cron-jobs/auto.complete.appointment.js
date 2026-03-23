const cron = require('node-cron');
const Appointment = require('../models/Counsellors/appointment.model');
const LogController = require('../controllers/System/logs/log.controller');


exports.AutoCompleteAppointments = () => {
    cron.schedule('*/10 * * * *', async () => {
        try {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Bulk update instead of looping
        const result = await Appointment.updateMany(
            {
            status: 'completed_by_counsellor',
            updatedAt: { $lte: twentyFourHoursAgo }
            },
            {
            $set: { status: 'completed' }
            }
        );

        if (result.modifiedCount > 0) {
            LogController(
            { email: "system@mindbridge.com" },
            'CRON',
            'success',
            `Auto-completed ${result.modifiedCount} appointments`
            );
        }

        console.log(`[Cron] Auto-completed ${result.modifiedCount} appointments.`);
        } catch (error) {
            console.error('[Cron AutoComplete Error]:', error);
        }
    });
};