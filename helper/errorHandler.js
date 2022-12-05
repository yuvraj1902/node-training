const fs = require('fs');

const commonErrorHandler = async (req, res, message, statusCode = 500, error = null) => {
  if (req.files) {
    Object.keys(req.files).forEach(function (file) {
      if (req.files[file].path) {
        fs.unlink(req.files[file].path, function (err) {
          console.log(err);
        });
      }
    });
  }

  let errorMessage = 'Something went wrong. Please try again';
  if (message) {
    errorMessage = message;
  }

  if (error && error.message) {
    errorMessage = error.message;
  }
  req.error = error;

  const response = {
    statusCode,
    data: {},
    message: errorMessage
  };

  res.status(statusCode).json(response);
};


module.exports = {
  commonErrorHandler
};
