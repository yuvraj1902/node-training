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
const createUserSchema = async (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().min(1).required(),
    last_name: Joi.string().min(1).required(),
    email: Joi.string().email().lowercase().required(),
    password: passwordComplexity(complexityOptions).required(),
    organization: Joi.string().min(1).required(),
    google_id: Joi.string().min(1).required(),
    source: Joi.string().min(1).required(),
    role_title: Joi.string().min(1).required(),
    designation_title: Joi.string().min(1).required(),
    reportee_id: Joi.string().guid(),
  });

  validateSchema(req, res, next, schema, "body");
};

const registrationSchema = async (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().min(1).required(),
    last_name: Joi.string().min(1).required(),
    email: Joi.string().email().lowercase().required(),
    password: passwordComplexity(complexityOptions).required(),
    organization: Joi.string().min(1).required(),
    google_id: Joi.string().min(1).required(),
    source: Joi.string().min(1).required(),
  });
  validateSchema(req, res, next, schema, "body");
};
module.exports = {
  loginSchema,
  createUserSchema,
  registrationSchema,
};
