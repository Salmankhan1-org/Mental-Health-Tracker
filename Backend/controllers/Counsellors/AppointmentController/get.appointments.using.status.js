const Appointment = require("../../../models/Counsellors/appointment.model");
const User = require("../../../models/User/userModel");
const { GetUserId } = require("../../../utils/User/get.user.id");

exports.GetAppointmentsUsingStatusController = async (request, response) => {
    try {
        const userId = GetUserId(request);
        const { status, page = 1, limit = 10, name, date } = request.query;

        if (status) {
            const skip = (parseInt(page) - 1) * parseInt(limit);

            let query = { 
                counsellor: userId, 
                status 
            };

           
            if (date) {
                const searchDate = new Date(date);

                searchDate.setHours(0, 0, 0, 0);
                
                query.date = searchDate

                //console.log("Searching between:", dayStart.toISOString(), "and", dayEnd.toISOString());
            }

            if (name) {
                const matchedStudents = await User.find({
                    name: { $regex: name, $options: 'i' }
                }).select('_id');
                
                const studentIds = matchedStudents.map(s => s._id);
                
                query.student = { $in: studentIds };
            }

        
            const [appointments, total] = await Promise.all([
                Appointment.find(query)
                    .populate('student', 'name email')
                    .sort({ date: -1, startTime: -1 })
                    .skip(skip)
                    .limit(parseInt(limit)),
                Appointment.countDocuments(query)
            ]);

            response.status(200).json({
                statusCode: 200,
                success: true,
                error: [],
                message: `${status} Appointments`,
                data: {
                    appointments,
                    pagination: {
                        total,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(total / limit)
                    }
                }
            });

        } else {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    { 
                        field: 'popup', 
                        message: 'Status is required' 
                    }
                ],
                message: ''
            });
        }
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