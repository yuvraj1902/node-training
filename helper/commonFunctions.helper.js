const { commonErrorHandler } = require('./errorHandler');


const validateRequest = (req, res, next, schema, requestParamterType) => {
  const options = {
    abortEarly: true, // include all errors
    allowUnknown: false, // ignore unknown props
    stripUnknown: true // remove unknown props
  };

  let requestData = {};
  if (requestParamterType === 'body') {
    requestData = req.body;
  } else if (requestParamterType === 'query') {
    requestData = req.query;
  } else {
    requestData = req.params;
  }

  const { error, value } = schema.validate(requestData, options);

  if (!error) {
    if (requestParamterType === 'body') {
      req.body = value;
    } else if (requestParamterType === 'query') {
      req.query = value;
    } else {
      req.params = value;
    }
    console.log(value);
    return next();
  }

  const { details } = error;
  const message = details.map(i => i.message).join(',');
  return commonErrorHandler(req, res, message, 422);
};



module.exports = {
  validateRequest
};
