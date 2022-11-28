const { createUser, loginUser, deactivateUser, forgetPassword, getAllUsers } = require("../services/user.service");


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

    forgetPassword: async (req, res, next) => {
        forgetPassword(req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        })
    },
    
    getAllUsers: async (req, res, next) => {
        getAllUsers((statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
         })
    }
    
}





