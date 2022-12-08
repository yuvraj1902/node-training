const Joi = require('joi');
const { validateRequest } = require('../helper/commonFunctions.helper');


module.exports = {
    userReporteeSchema: async (req, res, next) => {
        const schema = Joi.object({
            reporteeId: Joi.string().guid().required(),
        });
        validateRequest(req, res, next, schema, 'body');
    },

    adminReporteeSchema: async (req, res, next) => {
        const schema = Joi.object({
            managerId: Joi.string().guid().required(),
            reporteeId: Joi.string().guid().required(),
        });
        validateRequest(req, res, next, schema, 'body');
    },

};