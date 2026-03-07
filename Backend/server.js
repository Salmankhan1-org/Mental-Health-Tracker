const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/connectDB");
require("dotenv").config();

const AIChatRoutes = require("./routes/AI_Chats/routes.ai.chat");
const UserRoutes = require("./routes/User/routes.user")
const MoodCheckInRoutes = require("./routes/MoodCheckIn/mood.checkin.routes");
const DailyWellnessTipRoutes = require('./routes/DailyWellnessTip/daily.wellness.tip.routes');
const UserFeedbackRoutes = require('./routes/Feedback/feeback.routes');

const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () =>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});