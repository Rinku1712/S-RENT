const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const generateToken = require('../utils/generateToken');
const { sendOTPEmail, sendPasswordResetEmail } = require('./emailServices');

// Signup function
const signup = async (value) => {
  const existingUser = await User.findOne({ email: value.email });

  if (existingUser) {
    if (!existingUser.isEmailVerified) {
      // User registered previously but has not yet completed OTP verification
      const otp = crypto.randomInt(100000, 1000000).toString();
      const emailOTP = await bcrypt.hash(otp, 10);
      const emailOTPExpiry = new Date(Date.now() + 5 * 60 * 1000);

      existingUser.name = value.name || existingUser.name;
      existingUser.passwordHash = await bcrypt.hash(value.password, 10);
      existingUser.phone = value.phone || existingUser.phone;
      if (value.address) existingUser.address = value.address;
      existingUser.emailOTP = emailOTP;
      existingUser.emailOTPExpiry = emailOTPExpiry;
      existingUser.emailOTPAttempts = 0;

      await existingUser.save();
      await sendOTPEmail(existingUser.email, otp);

      return {
        message:
          'Account already initiated. A new OTP has been sent to complete your email verification.',
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        address: existingUser.address,
      };
    }

    const err = new Error('User Already Exist');
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(value.password, 10);

  // Generate a secure 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Hash OTP before storing it in database
  const emailOTP = await bcrypt.hash(otp, 10);

  // Set OTP expiry to 5 minutes
  const emailOTPExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const newUser = await User.create({
    name: value.name,
    email: value.email,
    passwordHash,
    phone: value.phone,
    address: value.address,
    isEmailVerified: false,
    emailOTP,
    emailOTPExpiry,
    emailOTPAttempts: 0,
  });

  // Send OTP to user's email
  await sendOTPEmail(newUser.email, otp);

  return {
    message:
      'Signup successful. Please verify your email using the OTP sent to your email address.',
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    address: newUser.address,
  };
};

// Login function
const login = async (value) => {
  const user = await User.findOne({
    email: value.email,
  }).select('+passwordHash');

  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 404;
    throw err;
  }

  if (user.accountStatus !== 'active') {
    const err = new Error('Your account is not active');
    err.statusCode = 403;
    throw err;
  }

  const isMatch = await bcrypt.compare(value.password, user.passwordHash);

  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 404;
    throw err;
  }

  if (!user.isEmailVerified) {
    const err = new Error('Please verify your email before logging in');
    err.statusCode = 403;
    throw err;
  }

  const token = generateToken(user._id);

  user.lastLoginAt = new Date();
  await user.save();

  return {
    token,
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};

// Changes made here: Verify user's email using OTP
const verifyOTP = async (value) => {
  // Find user and retrieve hidden OTP field
  const user = await User.findOne({
    email: value.email,
  }).select('+emailOTP');

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  // Check whether email is already verified
  if (user.isEmailVerified) {
    const err = new Error('Email is already verified');
    err.statusCode = 400;
    throw err;
  }

  // Check whether OTP exists
  if (!user.emailOTP) {
    const err = new Error('OTP not found. Please request a new OTP');
    err.statusCode = 400;
    throw err;
  }

  // Check maximum incorrect OTP attempts
  if (user.emailOTPAttempts >= 5) {
    const err = new Error('Maximum OTP attempts reached. Please request a new OTP');
    err.statusCode = 429;
    throw err;
  }

  // Check OTP expiry
  if (user.emailOTPExpiry < new Date()) {
    const err = new Error('OTP has expired. Please request a new OTP');
    err.statusCode = 400;
    throw err;
  }

  const isOTPMatch = await bcrypt.compare(String(value.otp), user.emailOTP);

  if (!isOTPMatch) {
    user.emailOTPAttempts += 1;
    await user.save();

    const err = new Error('Invalid OTP');
    err.statusCode = 400;
    throw err;
  }

  user.isEmailVerified = true;

  user.emailOTP = null;
  user.emailOTPExpiry = null;
  user.emailOTPAttempts = 0;

  await user.save();

  return {
    message: 'Email verified successfully',
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };
};

// Changes made here: Generate and resend OTP to existing unverified users
const resendOTP = async (value) => {
  // Find user using registered email
  const user = await User.findOne({
    email: value.email,
  });

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  // Check whether email is already verified
  if (user.isEmailVerified) {
    const err = new Error('Email is already verified');
    err.statusCode = 400;
    throw err;
  }

  // Changes made here: Generate a new six-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Changes made here: Hash OTP before saving
  const emailOTP = await bcrypt.hash(otp, 10);

  // Changes made here: Set new OTP expiry to five minutes
  const emailOTPExpiry = new Date(Date.now() + 5 * 60 * 1000);

  // Changes made here: Update OTP details in database
  user.emailOTP = emailOTP;
  user.emailOTPExpiry = emailOTPExpiry;
  user.emailOTPAttempts = 0;

  await user.save();

  // Changes made here: Send new OTP to registered email
  await sendOTPEmail(user.email, otp);

  return {
    message: 'New OTP sent successfully. Please check your email.',
    email: user.email,
  };
};

// Forgot Password: Send 6-digit reset code to user's registered email
const forgotPassword = async (value) => {
  if (!value.email) {
    const err = new Error('Email address is required');
    err.statusCode = 400;
    throw err;
  }

  const normalizedEmail = value.email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const err = new Error('No account found with this email address');
    err.statusCode = 404;
    throw err;
  }

  if (user.accountStatus !== 'active') {
    const err = new Error('Your account is currently suspended or blocked. Please contact support.');
    err.statusCode = 403;
    throw err;
  }

  // Generate 6-digit reset OTP
  const otp = crypto.randomInt(100000, 1000000).toString();
  const hashedOTP = await bcrypt.hash(otp, 10);
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.resetPasswordOTP = hashedOTP;
  user.resetPasswordOTPExpiry = expiry;
  user.resetPasswordAttempts = 0;
  await user.save();

  await sendPasswordResetEmail(user.email, otp);

  return {
    message: 'A password reset verification code has been sent to your email.',
    email: user.email,
  };
};

// Reset Password: Validate OTP and update password
const resetPassword = async (value) => {
  const { email, otp, newPassword } = value;

  if (!email || !otp || !newPassword) {
    const err = new Error('Email, verification code, and new password are required');
    err.statusCode = 400;
    throw err;
  }

  if (String(newPassword).length < 8) {
    const err = new Error('New password must be at least 8 characters long');
    err.statusCode = 400;
    throw err;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+resetPasswordOTP');

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  if (!user.resetPasswordOTP) {
    const err = new Error('No password reset request found. Please request a new code.');
    err.statusCode = 400;
    throw err;
  }

  if (user.resetPasswordAttempts >= 5) {
    const err = new Error('Maximum verification attempts reached. Please request a fresh reset code.');
    err.statusCode = 429;
    throw err;
  }

  if (user.resetPasswordOTPExpiry && user.resetPasswordOTPExpiry < new Date()) {
    const err = new Error('Password reset code has expired. Please request a new code.');
    err.statusCode = 400;
    throw err;
  }

  const isOTPMatch = await bcrypt.compare(String(otp).trim(), user.resetPasswordOTP);
  if (!isOTPMatch) {
    user.resetPasswordAttempts += 1;
    await user.save();
    const err = new Error('Invalid verification code. Please check and try again.');
    err.statusCode = 400;
    throw err;
  }

  // Update password and clear reset fields
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetPasswordOTP = null;
  user.resetPasswordOTPExpiry = null;
  user.resetPasswordAttempts = 0;
  user.isEmailVerified = true;
  await user.save();

  return {
    message: 'Password has been reset successfully. You can now log in with your new password.',
  };
};

module.exports = { signup, login, verifyOTP, resendOTP, forgotPassword, resetPassword };
