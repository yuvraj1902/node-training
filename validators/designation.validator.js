const Joi = require("joi");
const { validateRequest } = require("../helper/commonFunctions.helper");

module.exports = {
  designationSchema: async (req, res, next) => {
    const schema = Joi.object({
      user_id: Joi.string().guid().required(),
      designation_code: Joi.number().min(1).required(),
    });

    validateRequest(req, res, next, schema, "body");
  },
};
