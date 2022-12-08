const { commonErrorHandler } = require('../helper/errorHandler')
const userReporteeService = require('../services/userReportee.service');


const userAddReportee = async (req, res, next) => {
    try {
        const { body: payload } = req;
        const { user: user } = req;
        const data = await userReporteeService.userAddReportee(payload, user);
        res.data = data;
        next();
    } catch (error) {
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
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const userDeleteReportee = async (req, res, next) => {
    try {
        const { body: payload } = req;
        const { user: user } = req;
        const data = await userReporteeService.userDeleteReportee(payload, user);
        res.data = data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const adminDeleteReportee = async (req, res, next) => {
    try {
        const { body: payload } = req;
        const data = await userReporteeService.adminDeleteReportee(payload);
        res.data = data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

module.exports = {
    userAddReportee,
    adminAddReportee,
    userDeleteReportee,
    adminDeleteReportee
}
