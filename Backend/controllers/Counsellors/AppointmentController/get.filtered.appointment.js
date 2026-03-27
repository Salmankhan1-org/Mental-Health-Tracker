
const mongoose = require('mongoose');
const Appointment = require('../../../models/Counsellors/appointment.model');

exports.GetFilteredAppointmentsController = async (request, response) => {
    try {
    
        const { status, search, date, page = 1, limit = 5 } = request.query || request.body
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const pageSize = parseInt(limit);

       
        let matchQuery = {};
        if (status && status !== 'all') {
            matchQuery.status = status;
        }
        if (date) {
           
            const searchDate = new Date(date);

            searchDate.setHours(0, 0, 0, 0);

            matchQuery.date = searchDate
        }

        const pipeline = [
            { $match: matchQuery },
       
            {
                $lookup: {
                    from: 'users', 
                    localField: 'student',
                    foreignField: '_id',
                    pipeline: [
                        { $project: { name: 1, email: 1, profileImage : 1 } } 
                    ],
                    as: 'studentDetails'
                }
            },
            { $unwind: '$studentDetails' },
           
            {
                $lookup: {
                    from: 'users', 
                    localField: 'counsellor',
                    foreignField: '_id',
                    pipeline: [
                        { $project: { name: 1, email: 1, profileImage: 1 } } 
                    ],
                    as: 'counsellorDetails'
                }
            },
            { $unwind: '$counsellorDetails' },
          
            ...(search ? [{
                $match: {
                    $or: [
                        { 'studentDetails.name': { $regex: search, $options: 'i' } },
                        { 'counsellorDetails.name': { $regex: search, $options: 'i' } }
                    ]
                }
            }] : []),
          
            { $sort: { date: -1 } },
          
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [{ $skip: skip }, { $limit: pageSize }]
                }
            }
        ];

        const results = await Appointment.aggregate(pipeline);

        const appointments = results[0].data;
        const total = results[0].metadata[0]?.total || 0;

        response.status(200).json({
            success: true,
            data: {
                appointments,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: pageSize,
                    totalPages: Math.ceil(total / pageSize)
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
            message: 'Failed to fetch appointments'
        });
    }
};