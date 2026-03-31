const Communication = require("../../../models/system/communication.model");
const User = require("../../../models/User/userModel");
const { AdminMessageEmailTemplate } = require("../../../templates/admin.message.email.template");
const { sendEmail } = require("../../../utils/System/send.email");
const { GetUserId, GetUserEmail } = require("../../../utils/User/get.user.id");
const LogController = require("../../System/logs/log.controller");

exports.ContactToCounsellorController = async(request, response)=>{
    try {

        const {category, subject, message} = request.body;

        const senderId = GetUserId(request);
        const {receiverId} = request.params;

        request.body.email = GetUserEmail(request);

        // find reciever to get the email

        const receiver = await User.findById(receiverId).select('name email');

        if(!receiver){
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'popup',
                        message: 'Reciever Not Found'
                    }
                ],
                message: ''
            })
        }

        const log = await Communication.create({
            sender: senderId,
            receiver: receiverId,
            category,
            subject,
            message
        })
        
        try {

            // send Email
            const html = AdminMessageEmailTemplate({
                userName: receiver?.name,
                adminName: request?.user.name,
                subject,
                message,
                category
            });

            await sendEmail({
                to: receiver?.email,
                subject,
                html
            });

            await Communication.findByIdAndUpdate(log._id,{
                status: 'sent'
            });
            
        } catch (error) {
            await LogController(request,'message-sent', 'failed', 'Failed to send message');
            await Communication.findByIdAndUpdate(log._id,
                {status: 'failed'}
            );
            throw error;
        }

        await LogController(request,`Message Sent to ${receiver?.name}`, 'success', `Message has been sent from ${request?.body?.email} to ${receiver?.email}` );

        response.status(201).json({
            statusCode: 201,
            success: true,
            error:[],
            message: `Message Has been sent to ${receiver.name}`
        });
        
    } catch (error) {
        await LogController(request,'message-sent', 'failed', error?.message );
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