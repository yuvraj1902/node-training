const models = require("../models");
const { userAddReportee, adminAddReportee, userDeleteReportee, adminDeleteReportee } = require('../services/userReportee.service');

module.exports = {
  userAddReportee: async (req, res, next) => {
    userAddReportee(req.body, req.user, (statusCode, result) => {
      req.statusCode = statusCode;
      req.result = result;
      next();
    });
  },
  adminAddReportee: async (req, res, next) => {
    console.log(req.body);
    adminAddReportee(req.manager_id,req.reportee_id,(statusCode, result) => {
      req.statusCode = statusCode;
      req.result = result;
      next();
    });
  },

  userDeleteReportee: async (req, res, next) => {
    userDeleteReportee(req.body, req.user, (statusCode, result) => {
      req.statusCode = statusCode;
      req.result = result;
      next();
    });
  },

  adminDeleteReportee: async (req, res, next) => {
    adminDeleteReportee(req.body, (statusCode, result) => {
      req.statusCode = statusCode;
      req.result = result;
      next();
    });
  }
}
