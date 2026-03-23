const cron = require('node-cron');
const AppointmentReminderEmailTemplate = require('../templates/appointment.reminder.email.template');
const Appointment = require('../models/Counsellors/appointment.model');


//Send Reminder about upcoming appointments to user and counsellor before 1 hour and 10 minute before actual time of appointment

exports.AppointmentReminderCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);

      // ----------- 1 HOUR REMINDER -----------
      const oneHourAppointments = await Appointment.find({
        status: 'scheduled',
        reminderSent1h: false,
        date: {
          $gte: new Date(oneHourLater.getTime() - 60 * 1000),
          $lte: new Date(oneHourLater.getTime() + 60 * 1000),
        },
      }).populate('student counsellor', 'name email');

      for (const app of oneHourAppointments) {
        const htmlStudent = AppointmentReminderEmailTemplate(
            app.student.name,
            app.counsellor.name,
            app.date,
            '1 hour'
        );

        const htmlCounsellor = AppointmentReminderEmailTemplate(
            app.counsellor.name,
            app.student.name,
            app.date,
            '1 hour'
        );

        await Promise.all([
            sendEmail({
                to: app.student.email,
                subject: 'Upcoming Session Reminder',
                html: htmlStudent,
            }),
            sendEmail({
                to: app.counsellor.email,
                subject: 'Upcoming Session Reminder',
                html: htmlCounsellor,
            }),
        ]);

        app.reminderSent1h = true;
        await app.save();
      }

      // ----------- 10 MIN REMINDER -----------
      const tenMinAppointments = await Appointment.find({
        status: 'scheduled',
        reminderSent10m: false,
        date: {
            $gte: new Date(tenMinutesLater.getTime() - 60 * 1000),
            $lte: new Date(tenMinutesLater.getTime() + 60 * 1000),
        },
      }).populate('student counsellor', 'name email');

      for (const app of tenMinAppointments) {
        const htmlStudent = AppointmentReminderEmailTemplate(
            app.student.name,
            app.counsellor.name,
            app.date,
            '10 minutes'
        );

        const htmlCounsellor = AppointmentReminderEmailTemplate(
            app.counsellor.name,
            app.student.name,
            app.date,
            '10 minutes'
        );

        await Promise.all([
            sendEmail({
                to: app.student.email,
                subject: 'Session Starting Soon',
                html: htmlStudent,
            }),
            sendEmail({
                to: app.counsellor.email,
                subject: 'Session Starting Soon',
                html: htmlCounsellor,
            }),
        ]);

        app.reminderSent10m = true;
        await app.save();
      }

      if (oneHourAppointments.length || tenMinAppointments.length) {
        console.log(
          `[Cron] Sent ${oneHourAppointments.length} (1h) and ${tenMinAppointments.length} (10m) reminders`
        );
      }
    } catch (error) {
      console.error('[Reminder Cron Error]:', error);
    }
  });
};