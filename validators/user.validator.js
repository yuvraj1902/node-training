const Joi = require('joi')


module.exports = {
    loginSchema: async (req, res, next) => {
        try {
            const checkSchema = Joi.object({
                email: Joi.string().email().lowercase().required(),
                password: Joi.string().min(5).max(16).required()
            });
            const result = checkSchema.validate(req.body);
            if (result.error) {
                return res.status(400).json(result.error.details[0].message);
            } else {
                next();
            }
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong!' });
        }
    }
}
