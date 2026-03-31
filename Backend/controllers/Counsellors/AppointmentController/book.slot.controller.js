const Appointment = require("../../../models/Counsellors/appointment.model");
const Availability = require("../../../models/Counsellors/availability.model");
const User = require("../../../models/User/userModel");
const AppointmentRequestEmailTemplate = require("../../../templates/appointment.requested.by.user.template");
const { sendEmail } = require("../../../utils/System/send.email");
const { GetUserId, GetUserEmail } = require("../../../utils/User/get.user.id");
const LogController = require("../../System/logs/log.controller");
const {format} = require('date-fns');

exports.BookSlotForUserController = async(request, response)=>{
    try {

        const studentId = GetUserId(request); // From your Auth Middleware
        const {counsellorId, slotId} = request?.params;
        const {  date, startTime, endTime, meetingMethod } = request.body;
        if(!request.body){
            request.body = {}
        }
        request.body.email = GetUserEmail(request);

        if (studentId.toString() === counsellorId.toString()) {
            return response.status(400).json({ 
                statusCode: 400,
                success: false, 
                error: [
                    { 
                        field: "popup", 
                        message: "You cannot book an appointment with yourself." 
                    }
                ],
                message: ''
            });
        }

        const Counsellor = await User.findById(counsellorId);

        // 2. Past Time Validation
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        const now = new Date();
        
        // If today, check if startTime has passed
        const isToday = selectedDate.getTime() === new Date().setHours(0,0,0,0);
        if (isToday) {
            const [h, m] = startTime.split(":").map(Number);
            const startMinutes = h * 60 + m;
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            
            if (startMinutes <= currentMinutes) {
                return response.status(400).json({ 
                    statusCode: 400,
                    success: false, 
                    error: [
                        { 
                            field: "popup", 
                            message: "This slot has already passed." 
                        }
                    ],
                    message: ''
                });
            }
        }

        // 3. Template Verification
        // Ensure the slot actually exists in the counsellor's master availability
        const availability = await Availability.findOne({
            _id: slotId,
            counsellor: counsellorId,
            isActive: true
        });

        if (!availability) {
            return response.status(404).json({ 
                statusCode: 404,
                success: false, 
                error: [
                    { 
                        field: "popup", 
                        message: "Counsellor is not available at this time." 
                    }
                ],
                message: ''
            });
        }

        // 4. Atomic Booking Attempt
        // We try to create the appointment. Our Unique Index (counsellor, date, startTime) 
        // will catch any race conditions and throw an E11000 error if someone else just booked it.
        try {
            const existingRequest = await Appointment.findOne({
                student: studentId,
                counsellor: counsellorId,
                date: selectedDate,
                status: { $in: ["pending", "scheduled"] }
            });

            if (existingRequest) {
                return response.status(400).json({
                    statusCode: 400,
                    success: false, 
                    error: [
                        { 
                            field: "popup", 
                            message: "You already have a pending or scheduled session on this day." 
                        }
                    ],
                    message: '' 
                });
            }

        const newAppointment = await Appointment.create({
            counsellor: counsellorId,
            student: studentId,
            date: selectedDate,
            meetingMethod,
            startTime,
            endTime,
            slotId,
            status: "pending", // Default status for counsellor approval
        });

        const emailHtml = AppointmentRequestEmailTemplate(
            Counsellor.name, 
            request?.user?.name, 
            {
                date: format(new Date(selectedDate), 'PPP'),
                startTime,
                endTime,
                meetingMethod
            }
        );

        await sendEmail({
            to: Counsellor?.email,
            subject: `Action Required: New Request from ${request.user.name}`,
            html: emailHtml
        });

        await LogController(request, 'Requested A Booking Slot', 'success',`Requested a slot with ${Counsellor.email} on ${date}`);
        // 5. Success
        return response.status(201).json({
            statusCode: 201,
            success: true,
            error:[],
            message: "Booking request sent successfully. Waiting for counsellor approval.",
            data: newAppointment
        });

        } catch (dbError) {
            // Handle the Unique Index violation (The Race Condition)
            if (dbError.code === 11000) {
                return response.status(409).json({
                    statusCode: 409,
                    success: false,
                    error: [
                        { 
                            field: "popup", 
                            message: "This slot was just taken by someone else. Please pick another time." 
                        }
                    ],
                    message: ''
                });
            }
            throw dbError; // Pass other DB errors to global handler
        }
        
    } catch (error) {
        await LogController(request,'api::info','failed',error?.message);
        response.status(500).json({
            statusCode: 500,
            success: true,
            error:[
                {
                    field: 'popup',
                    message: error?.message
                }
            ],
            message: ''
        })
    }
}