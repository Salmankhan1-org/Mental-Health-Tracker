const User = require("../../models/User/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../utils/JWT/generate.jwt.token");

exports.UserLoginController = async(request, response, next) =>{

    try {
        const {email, password} = request?.body;
    //Basic validation
    if(!email || !password ){
        return response.status(400).json({
            statusCode: 400,
            success: false,
            error:[
                {
                    field: "popup",
                    message: "Required fields are missing"
                }
            ],
            message: ""
        })
    }else{
        // Check if user with this email exists or not
        const user = await User.findOne({email}).select("+password");
        if(user){ 
            // Check if password is correct or not
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(isPasswordValid){
                generateToken(response, user, 200, "User Logged in Successfully");
            }else{
                return response.status(401).json({
                    statusCode: 401,
                    success: false,
                    error:[
                        {
                            field: "popup",
                            message: "Invalid email or password"
                        }
                    ],
                    message: ""
                })
            }

            
        }else{
            response.status(404).json({
                statusCode: 404,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "User does not exist with this Email"
                    }
                ],
                message: ""
            })
        }
        
    }


    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "Error in logging in User"
                }
            ],
            message: ""
        })
    }

}