const { commonErrorHandler } = require('../helper/errorHandler');
const userService = require('../services/user.service');


const loginUser = async (req, res, next) => {
    try {
        const { body: payload } = req;
        console.log("controller","dy==67==2384727423464624=53723652345253=34=52=f=jsdggdhvchgcxjasvcgcavhc===");
        const data = await userService.loginUser(payload);
        res.data = data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const { userId: userId } = req.body;
        const refreshToken = req.refreshToken;
        const data = await userService.refreshToken(refreshToken, userId);
        res.data = data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const { query } = req
        const data = await userService.getAllUsers(query);
        res.data = data;
        next();
    } catch (error) {
       
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const logoutUser = async (req, res, next) => {
    try {
        let requestToken = req.headers["authorization"];
        requestToken = (requestToken ? requestToken.split(' ')[1] : null);
        const data = await userService.logoutUser(requestToken);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
    }
}
const resetPassword = async (req, res, next) => {
    try {
        const { body: payload, user } = req;
        const data = await userService.resetUserPassword(payload,user);
        res.data = data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
}


const resetPasswordByLink = async (req, res, next) => {
    try {
        const { body:payload, params } = req;
        const data = await userService.resetUserPassword(payload, {},params);
        res.data = data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
    
}


const adminResetPassword = async (req, res, next) => {
    try {
        const { body:payload,user} = req;
        const data = await userService.resetUserPassword(payload,user);
        res.data = data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const userDetail = async (req, res, next) => {
    try {
        const payload = {
            userId: req.user.id,
        }
         const data = await userService.userDetail(payload);
        res.data = data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
}


const adminUserDetail = async (req, res, next) => {
    try {
        const { params } = req;
        const payload = {
            userId: params.userId
        };

        const data = await userService.userDetail(payload);
        res.data = data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const forgetPassword = async (req, res, next) => {
    try {
        const { body: payload } = req;
        const data = await userService.forgetPassword(payload);
        res.data = data;
        next();

    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
}
const deactivateUser = async (req, res, next) => {
    try {

        const { body: payload } = req;
        const data = await userService.deactivateUser(payload);
        res.data = data;
        next()

    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const enableUser = async (req, res, next) => {
    try {

        const { body: payload } = req;
        const data = await userService.enableUser(payload);
        res.data = data;
        next()

    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const createUser = async (req, res, next) => {
    try {
        const { body: payload } = req;
        const response = await userService.createUser(payload);
        if (response.error) {
            throw new Error(response.error.message);
        }
        res.data = response.data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
};

const registration = async (req, res, next) => {
    try {
        const { body: payload } = req;
        const data = await userService.registration(payload);
        res.data = data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
};

module.exports = {
    loginUser,
    getAllUsers,
    refreshToken,
    logoutUser,
    resetPasswordByLink,
    userDetail,
    adminUserDetail,
    resetPassword,
    adminResetPassword,
    forgetPassword,
    deactivateUser,
    enableUser,
    createUser,
    registration
};


