const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error("page not found");
  error.path = req.originalUrl;
  next(error);
};

module.exports = notFound;
