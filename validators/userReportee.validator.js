const Joi = require("joi");

module.exports = {
  userReporteeSchema: async (req, res, next) => {
    try {
      const checkSchema = Joi.object({
        reportee_id: Joi.string().guid().required(),
      });
      const result = checkSchema.validate(req.body);
      if (result.error) {
        return res.status(400).json(result.error.details[0].message);
      } else {
        next();
      }
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong!" });
    }
  },

  adminReporteeSchema: async (req, res, next) => {
    try {
      const checkSchema = Joi.object({
        manager_id: Joi.string().guid().required(),
        reportee_id: Joi.string().guid().required(),
      });
      const result = checkSchema.validate(req.body);
      if (result.error) {
        return res.status(400).json(result.error.details[0].message);
      } else {
        next();
      }
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong!" });
    }
  },
};
