const Joi = require("joi");
const { validateSchema } = require("../helper/commonFunctions.helper");
const createRoleSchema = async (req, res, next) => {
  const schema = Joi.object({
    role_key: Joi.string().uppercase().required(),
    role_code: Joi.number().min(4).required(),
    role_title: Joi.string().required(),
  });
  validateSchema(req, res, next, schema, "body");
};
const changeRoleSchema = async (req, res, next) => {
  const schema = Joi.object({
    role_key: Joi.string().uppercase(),
    role_code: Joi.number().min(4).required(),
    role_title: Joi.string(),
  });
  validateSchema(req, res, next, schema, "body");
};

module.exports = {
    createRoleSchema,
    changeRoleSchema
}