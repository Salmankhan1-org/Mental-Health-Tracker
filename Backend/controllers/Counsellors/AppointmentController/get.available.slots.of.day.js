const Appointment = require("../../../models/Counsellors/appointment.model");
const Availability = require("../../../models/Counsellors/availability.model");
const { GetCounsellorId } = require("../../../utils/Counsellors/get.counselor.id");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

exports.GetAvailableSlotsByDateController = async (request, response) => {
    try {
        const { date } = request.query;
        // Ensure we are getting the ID correctly (usually from params or body for students)
        const counsellorId = request.params.counsellorId || GetCounsellorId(request);

        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);

        const dayOfWeek = days[selectedDate.getDay()];

        const now = new Date();
        const isToday = selectedDate.getTime() === new Date().setHours(0, 0, 0, 0);
        
        // Current time in minutes for comparison (e.g., 09:30 -> 570)
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        // 1. Get the Template for this weekday
        const availability = await Availability.findOne({
            counsellor: counsellorId,
            dayOfWeek,
            isActive: true
        });

        if (!availability) {
            return response.status(200).json({
                success: true,
                message: "Counsellor does not work on this day",
                data: []
            });
        }

        // 2. Fetch all active appointments for this specific date
        const appointments = await Appointment.find({
            counsellor: counsellorId,
            date: selectedDate,
            status: { $in: ["pending", "scheduled"] } // Include both to block the UI
        });

        // Create a lookup map for quick status checking
        // Key: "09:00-10:00", Value: "pending" | "scheduled"
        const appointmentMap = new Map(
            appointments.map(a => [`${a.startTime}-${a.endTime}`, a.status])
        );

        const timeToMinutes = (time) => {
            const [h, m] = time.split(":").map(Number);
            return h * 60 + m;
        };

        const minutesToTime = (minutes) => {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        };

        const allSlots = [];

        // 3. Generate slots from ranges and tag their status
        for (const range of availability.ranges) {
            let start = timeToMinutes(range.startTime);
            const end = timeToMinutes(range.endTime);
            const duration = range.duration;

            while (start + duration <= end) {
                const startTimeStr = minutesToTime(start);
                const endTimeStr = minutesToTime(start + duration);
                const slotKey = `${startTimeStr}-${endTimeStr}`;

                if (isToday && start <= currentMinutes) {
                    start += duration;
                    continue; 
                }

                // Determine the status of this specific slot
                let slotStatus = "available";
                if (appointmentMap.has(slotKey)) {
                    slotStatus = appointmentMap.get(slotKey); // will be "pending" or "scheduled"
                }

                allSlots.push({
                    slotId: availability._id, // Reference to the availability doc
                    startTime: startTimeStr,
                    endTime: endTimeStr,
                    status: slotStatus // available, pending (on hold), or scheduled (booked)
                });

                start += duration;
            }
        }

        return response.status(200).json({
            statusCode: 200,
            success: true,
            message: "Slots fetched successfully",
            data: allSlots
        });

    } catch (error) {
        return response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                { 
                    field: "popup", 
                    message: error.message 
                }
            ],
            message: ''
        });
    }
};