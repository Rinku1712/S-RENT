// JWT authentication middleware.
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authmiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization; // in authHeader bearer token

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //This checks whether the header exists and starts with Bearer
    return res.status(401).json({
      success: false,
      message: 'Please log in first',
    });
  }

  let decoded;
  try {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'srent_default_jwt_secret_key_secure_123';
    decoded = jwt.verify(token, secret);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }

  try {
    if (decoded.isSuperAdmin) {
      req.user = {
        _id: '000000000000000000000000',
        name: process.env.ADMIN_NAME || 'Super Admin',
        email: process.env.SUPER_ADMIN_EMAIL || 'admin@srent.com',
        role: 'superAdmin',
        accountStatus: 'active',
      };
      return next();
    }

    const authenticatedUser = await User.findById(decoded.id);

    // A valid token should not grant access to deleted or inactive accounts.
    if (
      !authenticatedUser ||
      authenticatedUser.isDeleted ||
      authenticatedUser.accountStatus !== 'active'
    ) {
      return res.status(401).json({
        success: false,
        message: 'User account is not available',
      });
    }

    req.user = authenticatedUser;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authmiddleware;
