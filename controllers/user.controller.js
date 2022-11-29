<<<<<<< HEAD
<<<<<<< HEAD
const { createUser, loginUser, deactivateUser,enableUser,userDetail,forgetPassword, getAllUsers,userInfo  } = require("../services/user.service");
=======
>>>>>>> 8583483 (add reset-password-api helper/sendmail validator/resetpasswordschemavalidator)
=======
=======
const { createUser, loginUser, deactivateUser,userInfo,resetUserPassword } = require("../services/user.service");
>>>>>>> c449232 (bugfix user.controller user.route)
>>>>>>> 4404825 (bugfix user.controller user.route)

const { createUser, loginUser, deactivateUser, forgetPassword, getAllUsers,userInfo,resetUserPassword } = require("../services/user.service");

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
<<<<<<< HEAD

    },
    enableUsers: async (req, res, next) => {
        enableUser(req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        })

    },
    userDetails: async (req, res, next) => {
        userDetail(req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        })
    },

    forgetPassword: async (req, res, next) => {
        forgetPassword(req.body, (statusCode, result) => {
=======
    },
    getUserInfo: async (req, res, next) => {
        console.log(req.user);
        userInfo(req.user.dataValues.email, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        })
    },

    resetUserPassword: async (req, res, next) => {
        resetUserPassword(req.query, req.body, (statusCode, result) => {
>>>>>>> c449232 (bugfix user.controller user.route)
            req.statusCode = statusCode;
            req.result = result;
            next();
        })
    },
    getUserInfo: async (req, res, next) => {
        console.log(req.user);
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
    
    getAllUsers: async (req, res, next) => {
        getAllUsers((statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
         })
    }
}





