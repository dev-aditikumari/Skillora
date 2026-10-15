const nodemailer = require("nodemailer");

const mailSender = async(email , title , body)=>{
    try{
        // TODO 1: create a "transporter" (the connection between our app and the email service)
        const transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            port : 587,
            auth:{
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            },
        });

        //TODO 2: send the mail
        const info = await transporter.sendMail({
            from : `"Skillora" <${process.env.MAIL_USER}>`,
            to: email ,
            subject : title,
            html : body
        });
        return info ; 
    }catch(err){
        console.error("Error sending email:", err);
        //TODO 3: should we hide the error , or re-throw it ? Think about the signup flow
        throw err; // re-throwing the error to be handled by the caller
    
    }
}

module.exports = mailSender;