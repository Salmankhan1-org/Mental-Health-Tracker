const redisClient = require("../../../config/redis")
const Availability = require("../../../models/Counsellors/availability.model")
const { GetUserId, GetUserEmail } = require("../../../utils/User/get.user.id")
const LogController = require("../../System/logs/log.controller")


exports.UpsertNewAvailabilityController = async (request, response) => {
  try {
    const counsellorId = GetUserId(request)
    const {payload:schedule, timezone} = request.body

    request.body.email = GetUserEmail(request);
    const redisKey = `counsellor-schedule:${counsellorId}`; 

    const results = []

    for (const dayData of schedule) {
      const { dayOfWeek, ranges } = dayData

      const availability = await Availability.findOneAndUpdate(
        {
          counsellor: counsellorId,
          dayOfWeek
        },
        {
            counsellor: counsellorId,
            dayOfWeek,
            ranges,
            timezone:timezone,
            isActive: true
        },
        {
            returnDocument: 'after',
            upsert: true
        }
      )

      results.push(availability)
    }

    await redisClient.del(redisKey);

    await LogController(request, 'New Schedule','success','New Schedule has been created');

    return response.status(201).json({
        statusCode: 201,
        success: true,
        error:[],
        message: "Your Schedule have been Saved Successfully",
        data: results
    })

  } catch (error) {
    await LogController(request, 'api::info','failed',error?.message);
    return response.status(500).json({
        statusCode: 500,
        success: false,
        error: [
            {
                field: 'popup',
                message: error?.message
            }
        ]
    })
  }
}