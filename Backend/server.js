const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/connectDB");
require("dotenv").config();
// later use a scripts to run these using npm
require('./workers/cron.worker.js');
require('./workers/generate.guidance.worker.js');

const AIChatRoutes = require("./routes/AI_Chats/routes.ai.chat");
const UserRoutes = require("./routes/User/routes.user")
const MoodCheckInRoutes = require("./routes/MoodCheckIn/mood.checkin.routes");
const DailyWellnessTipRoutes = require('./routes/DailyWellnessTip/daily.wellness.tip.routes');
const UserFeedbackRoutes = require('./routes/Feedback/feeback.routes');
const CounsellorsRoutes = require('./routes/Counsellors/routes.counsellor');
const AvailabilityRoutes = require('./routes/Counsellors/counsellor.availability.routes');
const GlobalErrorHandler = require("./middlewares/error.handler");
const AppointmentRoutes = require('./routes/Counsellors/counsellor.appointment.routes');
const { CancelExpiredAppointments } = require("./cron-jobs/cancel.expire.appointments");
const { AppointmentReminderCron } = require("./cron-jobs/appointment.reminder");
const { AutoCompleteAppointments } = require("./cron-jobs/auto.complete.appointment");
const StartAppointmentReminderCronJobs = require("./cron-jobs/appointment.reminder");

const app = express();
const PORT = process.env.PORT || 5000;

{/*
    ** Rate Limiter and helmet Apply here
*/}

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

app.get("/api/health", (request, response) =>{
    response.send("Server is healthy");
})

// Routes
app.use("/api/v1/ai-chats", AIChatRoutes);
app.use('/api/v1/users', UserRoutes );
app.use('/api/v1/mood',MoodCheckInRoutes);
app.use('/api/v1/wellness',DailyWellnessTipRoutes);
app.use('/api/v1/feedback', UserFeedbackRoutes);
app.use('/api/v1/counsellors', CounsellorsRoutes)
app.use('/api/v1/availability', AvailabilityRoutes);
app.use('/api/v1/appointment',AppointmentRoutes);


// CRON Jobs
CancelExpiredAppointments();
(async()=>{
    await StartAppointmentReminderCronJobs();
})()
AutoCompleteAppointments();

app.use(GlobalErrorHandler);

app.listen(PORT, () =>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});