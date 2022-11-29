const Joi = require('joi')


module.exports = {
    createDesignationSchema: async (req, res, next) => {
        try {
            const checkSchema = Joi.object({
                designation_code: Joi.number().integer().valid(101,102,103,104).required().label("Desigantion codes must be [102(LEAD),103(EMPLOYEE),104(INTERN)] only"),
                designation_title: Joi.string().uppercase().valid('LEAD','EMPLOYEE','INTERN').required().label("Desigantion title must be [LEAD,EMPLOYEE,INTERN] only"),
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
    changeDesignationSchema: async (req, res, next) => {
        try {
            const checkSchema = Joi.object({
                user_id: Joi.string().guid().required(),
                designation_title: Joi.string().uppercase().valid("LEAD","EMPLOYEE","INTERN").required().label("Desigantion title must be [LEAD,EMPLOYEE,INTERN] only"),
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