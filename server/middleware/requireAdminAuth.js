const { resolveAdminFromRequest } = require('../utils/adminAuth');

const requireAdminAuth = async (req, res, next) => {
  const admin = await resolveAdminFromRequest(req);

  if (!admin) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  req.admin = admin;
  next();
};

module.exports = requireAdminAuth;
