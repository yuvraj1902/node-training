<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
const { createUser, loginUser, deactivateUser,userInfo,resetUserPassword } = require("../services/user.service");
>>>>>>> c449232 (bugfix user.controller user.route)

<<<<<<< HEAD
const { createUser, loginUser, deactivateUser, forgetPassword, getAllUsers,userInfo,resetUserPassword } = require("../services/user.service");
=======
const {
  createUser,
  loginUser,
  deactivateUser,
} = require("../services/user.service");
>>>>>>> 1a26841 (registration-API)
>>>>>>> dbcbfa9 (registration-API)

const { createUser, loginUser, deactivateUser,enableUser,userDetail,forgetPassword, getAllUsers,userInfo ,resetUserPassword } = require("../services/user.service");
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
    userDetails: async (req, res, next) => {
        userDetail(req.body, (statusCode, result) => {
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
<<<<<<< HEAD
    
    getAllUsers: async (req, res, next) => {
        getAllUsers((statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
         })
    }
}




=======
  registration: async (req, res, next) => {
    createUser(req.body, (result, statusCode) => {
      // console.log(result," ",statusCode);
      (req.result = result), (req.statusCode = statusCode);
      next();
    });
  },
  createUser: async (req, res, next) => {
    createUser(req.body, (data, result) => {
      req.reportee_id = result;
      req.manager_id = data;
      next();
    });
  },
  deactiveUsers: async (req, res, next) => {
    deactivateUser(req.params, (statusCode, result) => {
      req.statusCode = statusCode;
      req.result = result;
      next();
    });
  },
};
>>>>>>> 1a26841 (registration-API)
