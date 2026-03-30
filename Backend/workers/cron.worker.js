const { Worker } = require("bullmq");
const connection = require('../config/bullmq.ioredis');
const AppointmentReminderEmailTemplate = require('../templates/appointment.reminder.email.template');
const Appointment = require('../models/Counsellors/appointment.model');

const sendReminders = async ({
    timeWindow,
    reminderField,
    reminderLabel,
    subject,
}) => {
    const appointments = await Appointment.find({
        status: 'scheduled',
        [reminderField]: false,
        date: {
        $gte: new Date(timeWindow.getTime() - 60 * 1000),
        $lte: new Date(timeWindow.getTime() + 60 * 1000),
        },
    })
        .populate('student counsellor', 'name email')
        .lean();

    if (!appointments.length) return 0;

    const ids = [];

    await Promise.all(
        appointments.map(async (app) => {
        ids.push(app._id);

        const htmlStudent = AppointmentReminderEmailTemplate(
            app.student.name,
            app.counsellor.name,
            app.date,
            reminderLabel
        );

        const htmlCounsellor = AppointmentReminderEmailTemplate(
            app.counsellor.name,
            app.student.name,
            app.date,
            reminderLabel
        );

        await Promise.all([
            sendEmail({
            to: app.student.email,
            subject,
            html: htmlStudent,
            }),
            sendEmail({
            to: app.counsellor.email,
            subject,
            html: htmlCounsellor,
            }),
        ]);
        })
    );

    await Appointment.updateMany(
        { _id: { $in: ids } },
        { $set: { [reminderField]: true } }
    );

    return appointments.length;
};

const worker = new Worker(
    "cron-jobs",
    async (job) => {
        if (job.name !== "run-every-minute") return;

        console.log("Running scheduled job at:", new Date());

        try {
        const now = new Date();

        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);

        const [oneHourCount, tenMinCount] = await Promise.all([
            sendReminders({
                timeWindow: oneHourLater,
                reminderField: 'reminderSent1h',
                reminderLabel: '1 hour',
                subject: 'Upcoming Session Reminder',
            }),
            sendReminders({
                timeWindow: tenMinutesLater,
                reminderField: 'reminderSent10m',
                reminderLabel: '10 minutes',
                subject: 'Session Starting Soon',
            }),
        ]);

        if (oneHourCount || tenMinCount) {
            console.log(
            `[Cron] Sent ${oneHourCount} (1h) and ${tenMinCount} (10m) reminders`
            );
        }
        } catch (error) {
        console.error('[Reminder Cron Error]:', error);
        throw error; // important for BullMQ retry handling
        }
    },
    {
        connection,
        concurrency: 5,
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed`, err);
});