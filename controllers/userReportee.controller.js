const {
    userDeleteReportee,
    adminDeleteReportee
} = require('../services/userReportee.service');

const { commonErrorHandler } = require('../helper/errorHandeler')
const userReporteeService = require('../services/userReportee.service');


const userAddReportee = async (req, res, next) => {
    try {
        const { body: payload } = req;
        const { user: user } = req;
        const data = await userReporteeService.userAddReportee(payload, user);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const adminAddReportee = async (req, res, next) => {
    try {
        const { body: payload } = req;
        const data = await userReporteeService.adminAddReportee(payload);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

module.exports = {
    userAddReportee,
    adminAddReportee,

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
