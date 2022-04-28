/* eslint-disable no-unused-vars */
const ErrorResponse = require('../utils/ErrorResponse');

const Error = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (process.env.NODE_ENV === 'development') console.log(error);

  if (err.name === 'CastError') {
    const message = `Resource not found with id ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message);
    error = new ErrorResponse(message, 400);
  }

  // duplicate value found
  if (err.code === 11000) {
    const message = `Duplicate value found!`;
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};
module.exports = Error;
