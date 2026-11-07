const nodemailer = require('nodemailer');

const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"SRENT" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification OTP - SRENT',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #e50914; margin-top: 0;">Email Verification</h2>
          <p>Thank you for signing up with SRENT. Your 6-digit verification code is:</p>
          <div style="background: #f8f9fa; padding: 16px; border-radius: 6px; text-align: center; margin: 20px 0;">
            <span style="font-size: 30px; font-weight: bold; letter-spacing: 6px; color: #111;">${otp}</span>
          </div>
          <p style="color: #555; font-size: 14px;">This OTP is valid for 5 minutes.</p>
          <p style="color: #888; font-size: 12px; margin-bottom: 0;">Please do not share this OTP with anyone. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error.message);
    const err = new Error('Failed to send verification email. Please try again.');
    err.statusCode = 500;
    throw err;
  }
};

module.exports = { sendOTPEmail };
