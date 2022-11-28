const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
    min: 4,
    max: 16,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1
};

module.exports = {
  loginSchema: async (req, res, next) => {
    try {
      const checkSchema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(4).max(16).required(),
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
  createUserSchema: async (req, res, next) => {
    try {
      const checkUserSchema = Joi.object({
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

            const result = checkUserSchema.validate(req.body);
            if (result.error) {
                return res.status(400).json(result.error.details[0].message);
            } else {
                next();
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },
    resetUserPasswordSchema: async (req, res, next) => {
        try {
            const checkresetPasswordSchema = Joi.object({
                password: passwordComplexity(complexityOptions).required(),
                token: Joi.string().required()
            });

            console.log(req.query);
            const result = checkresetPasswordSchema.validate(req.body,req.query);
            if (result.error) {
                return res.status(400).json(result.error.details[0].message);
            } else {
                next();
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }
}
