const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { jwtSecret } = require('../config/env');

const requireAdminAuth = async (req, res, next) => {
  const token = req.cookies?.adminToken;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    return res.status(401).json({ success: false, error: 'Token invalid or expired' });
  }

  const admin = await Admin.findById(payload.id).select('-password');
  if (!admin) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  if (admin.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  req.admin = admin;
  next();
};

module.exports = requireAdminAuth;
