const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'webdev15121985@gmail.com',
      pass: 'crqftepjimrdmphd'
    }
  });
  const mailOptions = {
    from: 'webdev15121985@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;