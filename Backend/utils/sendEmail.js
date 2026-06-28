const transporter = require("../app/config/mail");

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"OTP Login App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(" Email Sent Successfully");
  } catch (error) {
    console.log(" Email Sending Failed");
    console.log(error.message);
    throw error;
  }
};

module.exports = sendEmail;