const { registration, loginUser } = require("../services/user.service");


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
        registration(req.body, (data, result) => {
            let value = result;
            next();
        })

    }
};





