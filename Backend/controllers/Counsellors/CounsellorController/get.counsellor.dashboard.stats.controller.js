const Appointment = require("../../../models/Counsellors/appointment.model");
const { GetUserId } = require("../../../utils/User/get.user.id");
const mongoose = require('mongoose');

exports.GetCounsellorDashboardStatsController = async (request, response) => {
    try {
        const userId = GetUserId(request);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        // Calculate End of Week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const stats = await Appointment.aggregate([
            {
                $match: { counsellor: new mongoose.Types.ObjectId(userId) }
            },
            {
                $facet: {
                    totalThisWeek: [
                        { 
                            $match: 
                                { 
                                    date: 
                                    { 
                                        $gte: startOfWeek ,
                                        $lte: endOfWeek
                                    } 
                                }
                        },
                        { 
                            $count: "count" 
                        }
                    ],
                    upcoming: [
                        { 
                            $match: 
                                { 
                                    status: "scheduled", 
                                        date: 
                                        { 
                                            $gte: today 
                                        } 
                                } 
                        },
                        { 
                            $count: "count" 
                        }
                    ],
                    cancelled: [
                        { $match: { status: "cancelled" } },
                        { $count: "count" }
                    ],
                    completionData: [
                        { 
                            $group: {
                                _id: null,
                                completed: { 
                                    $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } 
                                },
                                total: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]);

        const result = stats[0];
        const totalSessions = result.completionData[0]?.total || 0;
        const completedSessions = result.completionData[0]?.completed || 0;
        const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

        response.status(200).json({
            statusCode: 200,
            success: true,
            error: [],
            message: "Dashboard Stats",
            data: {
                totalSessionsThisWeek: result.totalThisWeek[0]?.count || 0,
                upcomingSessions: result.upcoming[0]?.count || 0,
                cancelledSessions: result.cancelled[0]?.count || 0,
                completionRate: `${completionRate}%`
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
            message: ''
        });
    }
};