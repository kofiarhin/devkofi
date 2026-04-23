const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { jwtSecret } = require('../config/env');

const resolveAdminFromRequest = async (req) => {
  const token = req.cookies?.adminToken;

  if (!token) {
    return null;
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }

  const admin = await Admin.findById(payload.id).select('-password');

  if (!admin || admin.role !== 'admin') {
    return null;
  }

  return admin;
};

module.exports = {
  resolveAdminFromRequest,
};
