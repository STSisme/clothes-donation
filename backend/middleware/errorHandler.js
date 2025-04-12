const errorHandler = (err, req, res, next) => {
  console.error('❌ Error stack:', err.stack);

  let message = 'Something went wrong!';
  let statusCode = 500;

  // MySQL-specific error handling
  if (err.code === 'ER_DUP_ENTRY') {
    message = 'Duplicate entry. This data already exists.';
    statusCode = 400;
  } else if (err.code === 'ER_BAD_FIELD_ERROR') {
    message = 'Invalid field name in the database query.';
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: err.message,
  });
};

module.exports = errorHandler;
