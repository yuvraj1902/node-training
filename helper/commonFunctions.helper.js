const { commonErrorHandler } = require("./errorHandeler");
const validateSchema = async (req, res, next, schema, requestParamterType) => {
  let requestData = {};
  if (requestParamterType === "body") {
    requestData = req.body;
  } else if (requestParamterType === "query") {
    requestData = req.query;
  } else {
    requestData = req.params;
  }
  const { error, value } = schema.validate(requestData);

  if (!error) {
    if (requestParamterType === "body") {
      req.body = value;
    } else if (requestParamterType === "query") {
      req.query = value;
    } else {
      req.params = value;
    }
    return next();
  }


  return commonErrorHandler(req, res, error, 422);
};

module.exports = {
  validateSchema,
};
