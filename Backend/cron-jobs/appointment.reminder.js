
const cronQueue = require('../config/cron.queue');

const StartAppointmentReminderCronJobs = async () => {
	await cronQueue.add(
		"run-every-minute",
		{},
		{
			jobId: "appointment-reminder-cron",
			repeat: {
				pattern: "* * * * *", 
			},
			removeOnComplete: true,
			removeOnFail: true,
			attempts: 3,
			backoff: {
				type: "exponential",
				delay: 5000,
			},
		}
	);

	console.log("✅ Cron job scheduled with BullMQ");
};

module.exports = StartAppointmentReminderCronJobs;