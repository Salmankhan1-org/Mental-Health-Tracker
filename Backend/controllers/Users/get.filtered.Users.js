const Appointment = require("../../models/Counsellors/appointment.model");
const User = require("../../models/User/userModel");
const { GetUserId } = require("../../utils/User/get.user.id");


exports.GetFilteredUsersController = async (request, response) => {
    try {
        const { page = 1, limit = 5, search, role, status } = request.query;
        const adminId = GetUserId(request); 
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // 1. Build Dynamic Filter
        let query = { _id: { $ne: adminId }, isDeleted:false };

        if (role && role !== 'all') {
            query.role = role;
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // 2. Execute Query with Pagination
        const totalUsers = await User.countDocuments(query);
        const users = await User.find(query)
            .select("name email role createdAt profileImage status") // Safety first
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // 3. Attach Sessions Attained (Completed Appointments)
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const sessionsCount = await Appointment.countDocuments({
                student: user._id,
                status: "completed"
            });
            return { ...user, sessionsAttained: sessionsCount };
        }));

        return response.status(200).json({
            statusCode: 200,
            success: true,
            message: "Users retrieved successfully",
            data: {
                users: usersWithStats,
                pagination: {
                    total: totalUsers,
                    page: parseInt(page),
                    totalPages: Math.ceil(totalUsers / limit),
                    limit: parseInt(limit)
                }
            }
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
            message: ""
        });
    }
};