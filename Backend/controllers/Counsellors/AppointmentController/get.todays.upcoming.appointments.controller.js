const Appointment = require("../../../models/Counsellors/appointment.model");
const { GetUserId } = require("../../../utils/User/get.user.id");

exports.GetTodaysUpcomingAppointmentsController = async (request, response) => {
    try {
        const userId = GetUserId(request);
        
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        const allToday = await Appointment.find({
            counsellor: userId,
            status: "scheduled",
            date: { $gte: startOfDay, $lte: endOfDay }
        })
        .populate("student", "name email")
        .sort({ startTime: 1 }).limit(5);

        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

        const upcomingOnly = allToday.filter(apt => {
            const [time, modifier] = apt.startTime.split(' ');
            let [hours, minutes] = time.split(':').map(Number);

            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;

            const aptTimeInMinutes = hours * 60 + minutes;
            return aptTimeInMinutes >= currentTimeInMinutes;
        });

        response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: "Upcoming appointments for today fetched",
            data: upcomingOnly
        });
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                { 
                    field: 'popup', 
                    message: error?.message 
                }
            ],
            message: ""
        });
    }
};