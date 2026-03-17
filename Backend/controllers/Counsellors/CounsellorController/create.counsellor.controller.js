const Counsellor = require('../../../models/Counsellors/counsellor.model');
const counsellorApplicationSubmittedTemplate = require('../../../templates/counsellor.application.submitted.template');
const { sendEmail } = require('../../../utils/System/send.email');
const {GetUserId, GetUserEmail} = require('../../../utils/User/get.user.id');
exports.CreateNewCounsellorController = async(request, response)=>{
    try {

        const userId = GetUserId(request);
        const UserEmail = GetUserEmail(request);
        const EmailTemplate = counsellorApplicationSubmittedTemplate(request?.user?.name)
        const {title,
            bio,
            licenseNumber,
            experience,
            location,
            expertiseTags,
            virtualSessions} = request.body;

        
        const isAlreadySubmitted = await Counsellor.findOne({user:userId});

        
        if(!isAlreadySubmitted._id){
            const newCounsellor = await Counsellor.create(
            {   
                user: userId,
                title,
                expertiseTags,
                yearsOfExperience: experience,
                virtualSessions,
                location,
                licenseNumber,
                bio
            });
            
            if(newCounsellor._id){
                const MailOptions = {
                    to : UserEmail,
                    subject: 'Counsellor Application Submitted',
                    html: EmailTemplate
                }
                // Send Email to user 
                await sendEmail(MailOptions);
                return response.status(201).json({
                    statusCode: 201,
                    success: true,
                    error:[],
                    message: 'Application Submitted Successfully. Check Your Email'
                })

            }else{

                return response.status(203).json({
                    statusCode: 203,
                    success: false,
                    error:[
                        {
                            field: 'popup',
                            message: 'Failed to Create Counsellor'
                        }
                    ],
                    message: ''
                })
            }
        }else{
            return response.status(401).json({
                statusCode: 401,
                success: false,
                error:[
                    {
                        field: 'popup',
                        message: 'You have Already Submitted Your Application.'
                    }
                ]
            })
        }

        
        
    } catch (error) {
        response.status(500).json({
            statusCode:500,
            success: false,
            error:[
                {
                    field: 'popup',
                    message: error?.message
                }
            ],
            message:''
        })
    }
}