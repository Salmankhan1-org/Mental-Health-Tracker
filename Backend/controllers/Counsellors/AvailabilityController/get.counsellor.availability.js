const redisClient = require("../../../config/redis");
const Availability = require("../../../models/Counsellors/availability.model")
const { GetUserId } = require("../../../utils/User/get.user.id")

exports.GetCounsellorAvailableSchedulesController = async (request, response) => {
  try {

    const counsellorId = GetUserId(request)
    const redisKey = `counsellor-schedule:${counsellorId}`;

    const redisSchedules = await redisClient.get(redisKey);

    if(redisSchedules){
        return response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: "Counsellor Schedule",
            data: JSON.parse(redisSchedules)
        })
    }else{

        const schedules = await Availability.find({
            counsellor: counsellorId
        }).lean()

        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ]

        const scheduleMap = {}

        schedules.forEach((item) => {
            scheduleMap[item.dayOfWeek] = item
        })

        const formattedSchedule = days.map((day) => {

            if (scheduleMap[day]) {
                return scheduleMap[day]
            }

            return {
                counsellor: counsellorId,
                dayOfWeek: day,
                ranges: [],
                timezone: "Asia/Kolkata",
                isActive: false
            }
        })

        await redisClient.set(redisKey, JSON.stringify(formattedSchedule),{EX:900});

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: "Counsellor Schedule",
            data: formattedSchedule
        })
    }

    

  } catch (error) {

    return response.status(500).json({
      statusCode: 500,
      success: false,
      error: [
        {
          field: "popup",
          message: error?.message
        }
      ],
      message: ""
    })
  }
}