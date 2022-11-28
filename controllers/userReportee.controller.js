const { userAddReportee, adminAddReportee } = require('../services/userReportee.service');

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
    }
}
