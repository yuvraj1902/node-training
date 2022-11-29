const Joi = require('joi')


module.exports = {
    createRoleSchema: async (req, res, next) => {
        try {
            const checkSchema = Joi.object({
                role_key: Joi.string().uppercase().valid('ADM', 'USR').required().label("Role keys must be [ADM,USR] only"),
                role_code: Joi.number().min(4).required(),
                role_title: Joi.string().valid('Admin', 'User').required().label("Role title must be [Admin,User] only"),
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
    } ,
    changeRoleSchema: async (req, res, next) => {
        try {
            const checkSchema = Joi.object({
                user_id: Joi.string().guid().required(),
                role_title: Joi.string().valid("Admin","User").required().label("Role title must be [Admin,User] only"),
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
