const { commonErrorHandler } = require('../helper/errorHandler');
const userService = require('../services/user.service');


const loginUser = async (req, res, next) => {
    try {
        const { body: payload } = req;
        const data = await userService.loginUser(payload);
        res.data = data;
        next();
    } catch (error) {
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
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const data = await userService.getAllUsers();
        res.data = data;
        next();
    } catch (error) {
       
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
       
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { body, user } = req;
        const payload = {
            newPassword: body.password,
            userEmail: user.email,
            roleCode:user.Roles[0].role_code
        }
        const data = await userService.resetUserPassword(payload);
        res.data = data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
}


const resetPasswordByLink = async (req, res, next) => {
    try {
        const { body, params } = req;
        const payload = {
            newPassword: body.password,
            token:  params.token
        }
        const data = await userService.resetUserPassword(payload);
        res.data = data;
        next();
    } catch (error) {
        commonErrorHandler(req, res, error.message, 400, error);
    }
    
}


const adminResetPassword = async (req, res, next) => {
    try {
        const { body} = req;
        const payload = {
            newPassword: body.password,
            userEmail: body.email,
        }
        const data = await userService.resetUserPassword(payload);
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
        const { body } = req;
        const payload = {
            userId: body.userId
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


