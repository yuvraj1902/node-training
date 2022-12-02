const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { validateSchema } = require("../helper/commonFunctions.helper");

const complexityOptions = {
  min: 4,
  max: 16,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

const loginSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).max(16).required(),
  });
  validateSchema(req, res, next, schema, "body");
};
module.exports = {
  loginSchema,
};
