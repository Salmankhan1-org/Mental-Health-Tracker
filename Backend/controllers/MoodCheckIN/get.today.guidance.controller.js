const Guidance = require("../../models/AI/guidance.schema");
const redis = require("../../config/redis"); // your ioredis instance
const { GetUserId } = require("../../utils/User/get.user.id");
const redisClient = require("../../config/redis");

exports.GetTodayGuidanceController = async (request, response) => {
    try {
        const userId = GetUserId(request);

        const todayKey = new Date().toISOString().split("T")[0];
        const redisKey = `guidance:${userId}:${todayKey}`;

        // 1. Check Redis
        const cached = await redisClient.get(redisKey);

        if (cached) {
            return response.status(200).json({
                statusCode: 200,
                success: true,
                error:[],
                message: "Today's Guidance from Cache",
                data: JSON.parse(cached),
            });
        }

        // 2. Fetch from DB
        const guidance = await Guidance.findOne({
            student: userId,
            isDeleted: false,
            generatedForDay: todayKey
        }).lean();

        if (!guidance) {
            return response.status(200).json({
                statusCode: 200,
                success: true,
                error:[],
                message: 'Not Present for today',
                data: null,
            });
        }

        // 3. Store in Redis (TTL = 1 day)
        await redisClient.set(
            redisKey,
            JSON.stringify(guidance),
            "EX",
            60 * 60 * 24
        );

        return response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: "Today Guidance",
            data: guidance,
        });

    } catch (error) {
        return response.status(500).json({
            statusCode:500,
            success: false,
            error:[
                {
                    field: 'popup',
                    message: error?.message || 'Internal Server Error'
                }
            ],
            message: ''
        });
    }
};

