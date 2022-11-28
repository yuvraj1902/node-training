const { createUser, loginUser, deactivateUser,enableUser } = require("../services/user.service");


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
    deactivateUsers: async (req, res, next) => {
        deactivateUser(req.body, (statusCode, result) => {
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
        })

    },
    
};





