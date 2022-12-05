const Joi = require('joi');


module.exports = {
    createRoleSchema: async (req, res, next) => {
        try {
            const checkSchema = Joi.object({
                role_key: Joi.string().uppercase().required(),
                role_code: Joi.number().min(4).required(),
                role_title: Joi.string().required(),
            });
            const result = checkSchema.validate(req.body);
            if (result.error) {
                return res.status(400).json({ message: result.error.details[0].message });
            } else {
                next();
            }
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong!' });
        }
    },
    changeRoleSchema: async (req, res, next) => {
        try {
            const checkSchema = Joi.object({
                role_key: Joi.string().uppercase(),
                role_code: Joi.number().min(4).required(),
                role_title: Joi.string()
            });
            const result = checkSchema.validate(req.body);
            if (result.error) {
                return res.status(400).json({ message: result.error.details[0].message });
            } else {
                next();
            }
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong!' });
        }
    }
}