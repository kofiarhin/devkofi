const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

  const isMatch = admin ? await bcrypt.compare(password, admin.password) : false;

  if (!admin || !isMatch) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin._id, role: admin.role }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });

  res.cookie('adminToken', token, COOKIE_OPTIONS);

  return res.status(200).json({
    success: true,
    data: { email: admin.email, role: admin.role },
  });
};

const logoutAdmin = (req, res) => {
  res.clearCookie('adminToken', COOKIE_OPTIONS);
  return res.status(200).json({ success: true, message: 'Logged out' });
};

const getAdminSession = (req, res) => {
  return res.status(200).json({
    success: true,
    data: { email: req.admin.email, role: req.admin.role },
  });
};

module.exports = { loginAdmin, logoutAdmin, getAdminSession };
