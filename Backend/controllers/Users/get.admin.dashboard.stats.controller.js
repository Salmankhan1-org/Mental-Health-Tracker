const Appointment = require("../../models/Counsellors/appointment.model");
const Report = require("../../models/system/report.model");
const User = require("../../models/userModel");

// Helper to calculate percentage growth
const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    const growth = ((current - previous) / previous) * 100;
    return Math.round(growth);
};


exports.GetAdminDashboardStatsController = async(request, response)=>{
    try {

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

        // Fetch Current and Previous counts in parallel
        const [
            totalUsers, prevUsers,
            activeCounsellors, prevCounsellors,
            pendingApprovals,
            totalAppointments, prevAppointments,
            criticalReports
        ] = await Promise.all([
            // Total Users
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'student', createdAt: { $lt: thirtyDaysAgo } }),

            // Active Counsellors
            User.countDocuments({ role: 'counsellor', status: 'active' }),
            User.countDocuments({ role: 'counsellor', status: 'active', createdAt: { $lt: thirtyDaysAgo } }),

            // Pending Approvals (Usually doesn't need growth, just current count)
            User.countDocuments({ role: 'counsellor', status: 'pending' }),

            // Total Appointments
            Appointment.countDocuments({}),
            Appointment.countDocuments({ createdAt: { $lt: thirtyDaysAgo } }),

            // Critical Reports
            Report.countDocuments({ severity: 'critical', status: 'open' })
        ]);

        const stats = [
            {
                label: "Total Users",
                value: totalUsers,
                growth: calculateGrowth(totalUsers, prevUsers),
                icon: 'users'
            },
            {
                label: "Active Counsellors",
                value: activeCounsellors,
                growth: calculateGrowth(activeCounsellors, prevCounsellors),
                icon: 'counsellor'
            },
            {
                label: "Pending Approvals",
                value: pendingApprovals,
                growth: null, // Static count
                icon: 'pending'
            },
            {
                label: "Total Appointments",
                value: totalAppointments,
                growth: calculateGrowth(totalAppointments, prevAppointments),
                icon: 'appointment'
            },
            {
                label: "Critical Reports",
                value: criticalReports | 0,
                isCritical: true,
                icon: 'alert'
            }
        ];


        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'Admin Dashboard Stats Data',
            data: stats
        })
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: 'popup',
                    message: error?.message || 'Internal Server Error'
                }
            ],
            message: ''
        })
    }
}


