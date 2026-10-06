export const errorHandler = (err, req, res, next) => {
  console.error('Error caught by global handler:', err.stack || err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
