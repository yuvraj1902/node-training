const { commonErrorHandler } = require('../helper/errorHandler')
const userService = require('../services/user.service');
const { createUser } = require("../services/user.service");


const loginUser = async (req, res, next) => {
    try {
        const { body: payload } = req;
        console.log("Inside Controller")
        const data = await userService.loginUser(payload);
        console.log("Service done");
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

const resetPassword = async (req, res, next) => {
    try {
        const { body, user,params } = req;
        const payload = {
            newPassword: body.password,
            userEmail: user.email,
            token:(Object.keys(params).length>0?params.token:null)

        }
        console.log(payload);
        const data = await userService.resetUserPassword(payload);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}


const resetPasswordByLink = async (req, res, next) => {
    try {
        const { body,params } = req;
        const payload = {
            newPassword: body.password,
            userEmail: null,
            token:(Object.keys(params).length>0?params.token:null)
        }
        console.log(payload);
        const data = await userService.resetUserPassword(payload);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}




const adminResetPassword = async (req, res, next) => {
    try {
        const { body,params} = req;
        const payload = {
            newPassword: body.password,
            userEmail: body.userEmail,
            token:(Object.keys(params).length>0?query.token:null)

        }
        console.log(payload);
        const data = await userService.resetUserPassword(payload);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const getUserInfo = async (req, res, next) => {
    try {
        const payload = {
            userId: req.user.id,
        }
        const data = await userService.userInfo(payload);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}


const getUserDetail = async (req, res, next) => {
    const { body } = req;
    const payload = {
        userId: body.userId
    };

    const data = await userService.userDetail(payload);
    res.data = data;
    next();
}

module.exports = {
    loginUser,
    getAllUsers,
    refreshToken,
    logoutUser,
    resetPasswordByLink,
    getUserInfo,
    getUserDetail,
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

   
    resetPassword,
    adminResetPassword

};







