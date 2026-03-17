const nodemailer = require("nodemailer");


exports.sendEmail = async({to, subject, html})=>{
  
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT,
        secure: false,
        auth:{
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from : `"Mind Bridge Pvt. Ltd" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Failed to send Email')
    }
   
}
