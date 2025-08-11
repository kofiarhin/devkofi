const errorHandler = async (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  return res.status(statusCode).json({ successs: false, error: error.message });
};

module.exports = errorHandler;
