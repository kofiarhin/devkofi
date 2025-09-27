const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  const response = {
    success: false,
    error: error.message || "Internal server error",
  };

  if (process.env.NODE_ENV === "development" && error.stack) {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
