const { ApiError } = require('../utils/apiError');

function notFound(req, _res, next) {
  next(new ApiError(`Not Found - ${req.originalUrl}`, 404));
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
}

module.exports = { notFound, errorHandler };
