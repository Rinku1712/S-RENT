const jwt = require('jsonwebtoken');

function generateToken(userId, isSuperAdmin = false) {
  const secret = process.env.JWT_SECRET || 'srent_default_jwt_secret_key_secure_123';
  const payload = {
    id: userId,
  };

  if (isSuperAdmin) {
    payload.isSuperAdmin = true;
  }

  const token = jwt.sign(payload, secret, {
    expiresIn: '7d',
  });

  return token;
}

module.exports = generateToken;
