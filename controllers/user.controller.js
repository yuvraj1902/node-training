const { createUser, loginUser, deactivateUser,resetUserPassword } = require("../services/user.service");


module.exports = {

    // login API
    loginUsers: async (req, res, next) => {
        loginUser(req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
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

    resetUserPassword: async (req, res, next) => {
        resetUserPassword(req.query, req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        })
    },
};





