const nodemailer = require('nodemailer');

const getTransporter = () => {
  const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : '';

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
};

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"SRENT" <${user}>`,
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

// Function to send Password Reset OTP email
const sendPasswordResetEmail = async (email, otp) => {
  try {
    const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"S-RENT" <${user}>`,
      to: email,
      subject: 'Password Reset Code - S-RENT',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; background: #E93636; color: #ffffff; font-weight: 900; font-size: 20px; padding: 8px 14px; border-radius: 8px; letter-spacing: -1px;">SR</div>
            <h2 style="color: #171717; margin: 12px 0 4px; font-size: 22px;">Reset Your Password</h2>
            <p style="color: #737373; font-size: 14px; margin: 0;">S-RENT Peer-to-Peer Rental Marketplace</p>
          </div>
          <p style="color: #333333; font-size: 14px; line-height: 1.5;">We received a request to reset your S-RENT account password. Use the verification code below to set a new password:</p>
          <div style="background: #F8F9FB; border: 1px dashed #E5E7EB; padding: 18px; border-radius: 8px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #E93636; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #555555; font-size: 13px; line-height: 1.5;">This code will expire in <strong>10 minutes</strong>. For your security, do not share this code with anyone.</p>
          <div style="border-top: 1px solid #e5e7eb; margin-top: 24px; padding-top: 16px;">
            <p style="color: #999999; font-size: 12px; margin: 0; line-height: 1.4;">If you did not initiate this password reset, you can safely disregard this email. Your password will remain unchanged.</p>
          </div>
        </div>
      `,
    });

    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error.message);
    const err = new Error('Failed to send password reset email. Please try again.');
    err.statusCode = 500;
    throw err;
  }
};

module.exports = { sendOTPEmail, sendPasswordResetEmail };
