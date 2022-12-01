const { createUser,
    deactivateUser,
    userInfo,
    resetUserPassword,
    forgetPassword,
    enableUser,
    userDetail } = require('../services/user.service');

const { commonErrorHandler } = require('../helper/errorHandler')


const userService = require('../services/user.service');


const loginUser = async (req, res, next) => {
    try {
        const { body: payload } = req;
        const data = await userService.loginUser(payload);
        res.data = data;
        next();
    } catch (error) {
        // console.log('-----', error);
        // console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: requestToken } = req.body;
        const data = await userService.refreshToken(requestToken);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const data = await userService.getAllUsers();
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const logoutUser = async (req, res, next) => {
    try {
        const { refreshToken: requestToken } = req.body;
        const data = await userService.logoutUser(requestToken);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

// user level accell
// self pwd reset
const resetpPwd = async (req, res, next) => {
    try {
        const { body, user } = req;
        const payload = {
            userId: user.id,
            newPassword: body.password
        }
        const data = await userService.loginUser(payload);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

// admin level accell
// admin pwd reset
const adminPwdReset = async (req, res, next) => {
    try {
        const { body } = req;
        const payload = {
            userId: body.id,
            newPassword: body.password
        }
        const data = await userService.loginUser(payload);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}


module.exports = {
    loginUser,
    getAllUsers,
    refreshToken,
    logoutUser,
    // createUser API
    registration: async (req, res, next) => {
        createUser(req.body, (result, statusCode) => {
            (req.result = result), (req.statusCode = statusCode);
            next();
        });
    },

    createUser: async (req, res, next) => {
        createUser(req.body, (data, result) => {
            (req.body = data), (req.statusCode = result);
            next();
        });
    },
    deactivateUsers: async (req, res, next) => {
        deactivateUser(req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        })
    },
    getUserInfo: async (req, res, next) => {
        userInfo(req.user.dataValues.email, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        })
    },

    resetUserPassword: async (req, res, next) => {
        resetUserPassword(req.query, req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        })
    },

    forgetPassword: async (req, res, next) => {
        forgetPassword(req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        })
    },



    enableUsers: async (req, res, next) => {
        enableUser(req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        });
    },

    userDetails: async (req, res, next) => {
        userDetail(req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        });
    },

};







