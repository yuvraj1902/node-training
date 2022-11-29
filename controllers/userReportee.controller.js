const models = require("../models");
const {
  addReportee,
  adminAddReportee,
} = require("../services/userReportee.service");

module.exports = {
  addReportee: async (req, res, next) => {
    addReportee(req.params.id, req.body.id, (statusCode, result) => {
      req.statusCode = statusCode;
      req.result = result;
      next();
    });
  },
  adminAddReportee: async (req, res, next) => {
    adminAddReportee(req.body, (statusCode, result) => {
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
  },
};
