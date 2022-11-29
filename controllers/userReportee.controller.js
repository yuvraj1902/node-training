const {
    userAddReportee,
    adminAddReportee,
    userDeleteReportee,
    adminDeleteReportee
} = require("../services/userReportee.service");

module.exports = {
    userAddReportee: async (req, res, next) => {
        userAddReportee(req.params.id, req.body.id, (statusCode, result) => {
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

<<<<<<< HEAD
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

=======
>>>>>>> feature/temp
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
