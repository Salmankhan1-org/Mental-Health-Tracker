const mongoose  = require("mongoose");
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
                counsellor: new mongoose.Types.ObjectId(userId), 
                status 
            };

           
            if (date) {
                const searchDate = new Date(date);

                searchDate.setHours(0, 0, 0, 0);
                
                query.date = searchDate

               
            }

            if (name) {
                const matchedStudents = await User.find({
                    name: { $regex: name, $options: 'i' }
                }).select('_id');
                
                const studentIds = matchedStudents.map(s => s._id);
                
                query.student = { $in: studentIds };
            }

            const parsedLimit = parseInt(limit);

            // pipelines for better optimization 
            const pipeline = [
                // match the query
                {
                    $match: query
                },
                {
                    $sort:{ date : -1 , startTime : -1 }
                },
                {$skip:skip},
                {$limit:parsedLimit},
                {
                    $lookup:{
                        from:'users',
                        let: {studentId: '$student'},
                        pipeline:[
                            {
                                $match:{
                                    $expr: { $eq: ['$_id', '$$studentId'] }
                                }
                            },
                            {
                                $project:{
                                    _id:1,
                                    name: 1,
                                    email:1
                                }
                            }
                        ],
                        as: 'student'
                    }
                },
                {$unwind:{path:'$student', preserveNullAndEmptyArrays:true}},
            ];

            const [appointments, total] = await Promise.all([
                Appointment.aggregate(pipeline),
                Appointment.countDocuments(query)
            ])

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