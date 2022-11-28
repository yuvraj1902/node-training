const { createUser, loginUser, deactivateUser, userInfo } = require("../services/user.service");


module.exports = {
    // login API
    loginUsers: async (req, res, next) => {
        loginUser(req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        });
    },

    // createUser API
    registration: async (req, res, next) => {
        createUser(req.body, (result, statusCode) => {
            // console.log(result," ",statusCode);
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
    deactiveUsers: async (req, res, next) => {
        deactivateUser(req.params, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        })
    },
    getUserInfo: async (req, res, next) => {
        userInfo(req.email, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        })
    },
};
