const Joi = require("joi");
const { validateRequest } = require("../helper/commonFunctions.helper");

const userReporteeSchema = async (req, res, next) => {
  const schema = Joi.object({
    reportee_id: Joi.string().guid().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const adminReporteeSchema = async (req, res, next) => {
  const schema = Joi.object({
    manager_id: Joi.string().guid().required(),
    reportee_id: Joi.string().guid().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

module.exports = {
  userReporteeSchema,
  adminReporteeSchema,
};
