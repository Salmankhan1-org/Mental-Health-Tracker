
const Appointment = require("../../models/Counsellors/appointment.model");
const User = require("../../models/User/userModel");
const { GetUserId } = require("../../utils/User/get.user.id");

exports.GetAllUsersByAdminWithStatsController = async (request, response) => {
    try {
        const adminId = GetUserId(request);
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments({ _id: { $ne: adminId } });
        
        const users = await User.find({ _id: { $ne: adminId } })
            .select("name email role createdAt profileImage status")
            .skip(skip)
            .limit(limit)
            .lean();

        const usersWithStats = await Promise.all(users.map(async (user) => {
            const completedCount = await Appointment.countDocuments({
                student: user._id,
                status: "completed"
            });
            return { ...user, sessionsAttained: completedCount };
        }));

        response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: "Users fetched successfully",
            data: {
                users: usersWithStats,
                pagination: {
                    total:totalUsers,
                    page: parseInt(page),
                    totalPages: Math.ceil(totalUsers / limit),
                    limit: parseInt(limit)
                }
            }
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