const commonErrorHandler = async (req, res, message, statusCode) => {
  let errorMessage = "Something went wrong. Please try again";
  if (message) {
    errorMessage = message;
  }

  req.error = message;

  const response = {
    statusCode,
    message: errorMessage,
  };

  res.status(statusCode).json(response);
};

module.exports = {
  commonErrorHandler,
};
