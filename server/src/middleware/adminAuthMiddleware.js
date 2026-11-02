const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const adminauthmiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Admin token is required',
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // SuperAdmin is configured via env variables and not stored as a normal User document
    if (decoded.id !== 'super-admin' || decoded.isSuperAdmin !== true) {
      return res.status(403).json({
        success: false,
        message: 'Super Admin access denied',
      });
    }

    req.isSuperAdmin = true;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

module.exports = adminauthmiddleware;
