const Joi = require('joi')


module.exports = {
    roleSchema: async (req, res, next) => {
        try {
            const checkSchema = Joi.object({
                role_key: Joi.string().uppercase().valid('ADM', 'USR','GST').required(),
                role_code: Joi.number().min(4).required(),
                role_title: Joi.string().valid('Admin', 'User',"Guest").required(),
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
