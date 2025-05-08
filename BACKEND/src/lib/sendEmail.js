const nodemailer = require("nodemailer") ; 


function sendMailServer(subject,recipient) {
      // Create a transporter object that will handle the sending of the email
      const transporter = nodemailer.createTransport({
        service: "gmail", // or use any SMTP provider
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls:{
          rejectUnauthorized:false
        }
      });
      
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: subject,
        text: 'This is a test email'
      };
      
      // Use the transporter object to send the email
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(500).json({message:"error sending mail",boolean:false});
        } 
      });
}

module.exports = sendMailServer ;

