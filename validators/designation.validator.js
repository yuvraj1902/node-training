const Joi = require("joi");
const { validateRequest } = require("../helper/commonFunctions.helper");

module.exports = {
  designationSchema: async (req, res, next) => {
    const schema = Joi.object({
      userId: Joi.string().guid().required(),
      designationCode: Joi.number().min(1).required(),
    });

    validateRequest(req, res, next, schema, "body");
  },
};
