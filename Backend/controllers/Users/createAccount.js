
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../utils/JWT/generate.jwt.token");
const User = require("../../models/User/userModel");

exports.CreateUserAccountController = async (request, response) => {
    try {
        const {name, email,picture} = request.body;

        let user = await User.findOne({email});

        // if user already exist then login otherwise Create a new Account with that email

        if(user){
            user.isEmailVerified = true;
        }else{
            let password = 'login#through#google'
            const hashedPassword = await bcrypt.hash(password,10);
            user = new User({name,email,password:hashedPassword,isEmailVerified:true,profileImage:picture});
        }

        await user.save();

        generateToken(response, user, 200, "User Logged in Successfully");
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: "googleLogin",
                    message: "Error in Google Login"
                }
            ],
            message: ""
        })
        
    }
};
