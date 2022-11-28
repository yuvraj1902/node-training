const models = require("../models");
const { userAddReportee, adminAddReportee, userDeleteReportee } = require('../services/userReportee.service');

module.exports = {

    userAddReportee: async (req, res, next) => {
        userAddReportee(req.body, req.user, (statusCode, result) => {
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
    }
}