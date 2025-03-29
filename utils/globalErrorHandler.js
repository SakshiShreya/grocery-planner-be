const handleEntityTooLargeError = err => {
  err.message = `File too large. Please upload a file less than 1MB`;
  return err;
};

const handleCastErrorDB = err => {
  err.message = `Invalid ${err.path}: ${err.value}`;
  err.statusCode = 400;
  return err;
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  let error = { ...err };

  if (err.type === 'entity.too.large') {
    error = handleEntityTooLargeError(error);
  }

  if (err.name === "CastError") {
    error = handleCastErrorDB(err);
  }

  return res.status(err.statusCode).json({
    message: error.message
  });
};
