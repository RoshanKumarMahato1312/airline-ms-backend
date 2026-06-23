const { ApiError } = require('../utils/apiError');

function notFound(req, _res, next) {
  next(new ApiError(`Not Found - ${req.originalUrl}`, 404));
}

const fs = require('fs');

function errorHandler(err, _req, res, _next) {
  console.error('ERROR in middleware:', err);
  fs.appendFileSync('error.log', new Date().toISOString() + '\\n' + (err.stack || err.message || err) + '\\n\\n');
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
}

module.exports = { notFound, errorHandler };
