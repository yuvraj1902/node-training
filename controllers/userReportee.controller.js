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
    console.log(req.body);
    adminAddReportee(req.manager_id,req.reportee_id,(statusCode, result) => {
      req.statusCode = statusCode;
      req.result = result;
      next();
    });
  },
};
