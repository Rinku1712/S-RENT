// Handle authentication requests and responses.
const authServices = require('../services/authService');

const signup = async (req, res) => {
  try {
    const user = await authServices.signup(req.body);
    console.log(user);
    res.status(201).json({ message: 'User Created Successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error Found in Sign-Up', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await authServices.login(req.body);
    res.status(200).json({ message: 'User Login Successfully', user });
  } catch (error) {
    // Keep validation and authentication failures from being reported as server errors.
    // console.log(error.statusCode);
    res.status(error.statusCode || 500).json({
      error: error.message,
      message: 'Error Found in Login',
    });
  }
};
const verifyOTP = async (req, res) => {
  try {
    const result = await authServices.verifyOTP(req.body);

    res.status(200).json({
      message: 'Email Verified Successfully',
      result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Error Found in Email Verification',
      error: error.message,
    });
  }
};
const resendOTP = async (req, res) => {
  try {
    const result = await authServices.resendOTP(req.body);
    res.status(200).json({
      message: 'User verified Successfully',
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error Founded in ResendOTP',
      error: error.message,
    });
  }
};
module.exports = { signup, login, verifyOTP, resendOTP };
