const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Send email notification
exports.sendEmailNotification = async (userEmail, flightInfo) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aadidaa609@gmail.com',
      pass: 'your-email-app-password'
    }
  });

  const mailOptions = {
    from: 'aadidaa609@gmail.com',
    to: userEmail,
    subject: 'Flight Price Drop Alert',
    text: `The price for your flight from ${flightInfo.departure} to ${flightInfo.destination} has dropped. New price: ${flightInfo.price}.`
  };

  await transporter.sendMail(mailOptions);
};

// Send SMS notification
exports.sendSMSNotification = async (userMobile, flightInfo) => {
  const client = twilio('your-account-sid', 'your-auth-token');
  
  await client.messages.create({
    body: `Flight price drop: ${flightInfo.departure} to ${flightInfo.destination}. New price: ${flightInfo.price}.`,
    from: '+1234567890',  // Your Twilio number
    to: userMobile
  });
};
