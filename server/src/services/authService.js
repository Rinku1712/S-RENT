const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const generateToken = require('../utils/generateToken');
const { sendOTPEmail } = require('./emailServices');

// Signup function
const signup = async (value) => {
  const existingUser = await User.findOne({ email: value.email });

  if (existingUser) {
    const err = new Error('User Already Exist');
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(value.password, 10);

  // Changes made here: Generate a secure 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Changes made here: Hash OTP before storing it in database
  const emailOTP = await bcrypt.hash(otp, 10);

  // Changes made here: Set OTP expiry to 5 minutes
  const emailOTPExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const newUser = await User.create({
    name: value.name,
    email: value.email,
    passwordHash,
    phone: value.phone,
    address: value.address,

    // Changes made here: Save OTP verification details
    isEmailVerified: false,
    emailOTP,
    emailOTPExpiry,
    emailOTPAttempts: 0,
  });

  // Changes made here: Send OTP to user's email
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

// Login function (unchanged for now)
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
    throw new Error('Your account is not active');
  }

  const isMatch = await bcrypt.compare(value.password, user.passwordHash);

  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 404;
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

  const isOTPMatch = await bcrypt.compare(value.otp, user.emailOTP);

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

module.exports = { signup, login, verifyOTP, resendOTP };
