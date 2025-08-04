const errorHandler = async (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  const errorMessage = error.message ? error.message : "internal server error";
  return res.status(statusCode).json({ success: false, error: errorMessage });
};

module.exports = errorHandler;
