const Joi = require('joi')


module.exports = {
    addReporteeSchema: async (req, res, next) => {
        try {
            const checkSchema = Joi.object({
                id: Joi.string().guid()
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
    },

    adminAddReporteeSchema: async (req, res, next) => {
        try {
            const checkSchema = Joi.object({
                manager_id: Joi.string().guid(),
                reportee_id: Joi.string().guid()
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
