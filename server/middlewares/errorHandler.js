const errorHandler = async (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  return res.status(statusCode).json({ success: false, error: error.message });
};

module.exports = errorHandler;
