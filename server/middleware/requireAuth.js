const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded?.id || decoded?._id || decoded?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid token payload" });
    }

    req.userId = userId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Not authorized" });
  }
};

module.exports = requireAuth;
