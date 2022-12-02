<<<<<<< HEAD
const Joi = require("joi");
const { validateRequest } = require("../helper/commonFunctions.helper");

module.exports = {
  userReporteeSchema: async (req, res, next) => {
    const schema = Joi.object({
      reportee_id: Joi.string().guid().required(),
    });
    validateRequest(req, res, next, schema, "body");
  },

  adminReporteeSchema: async (req, res, next) => {
    const schema = Joi.object({
      manager_id: Joi.string().guid().required(),
      reportee_id: Joi.string().guid().required(),
    });
    validateRequest(req, res, next, schema, "body");
  },
=======
const Joi = require('joi');
const { validateRequest } = require('../helper/commonFunctions.helper');

module.exports = {
    userReporteeSchema: async (req, res, next) => {
        const schema = Joi.object({
            reportee_id: Joi.string().guid().required(),
        });
        validateRequest(req, res, next, schema, 'body');
    },

    adminReporteeSchema: async (req, res, next) => {
        const schema = Joi.object({
            manager_id: Joi.string().guid().required(),
            reportee_id: Joi.string().guid().required(),
        });
        validateRequest(req, res, next, schema, 'body');
    },

>>>>>>> 05818d1 (Refactor userAddReportee and adminAddReportee API)
};
