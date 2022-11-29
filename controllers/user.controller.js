
const {
  createUser,
  loginUser,
  deactivateUser,
  userInfo,
  resetUserPassword,
  forgetPassword,
  getAllUsers,
  registration,
} = require("../services/user.service");
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
    
    
    getAllUsers: async (req, res, next) => {
        getAllUsers((statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
         })
    },
  
  // createUser API
  registration: async (req, res, next) => {
    registration(req.body, (statusCode, result) => {
      (req.result = result), (req.statusCode = statusCode);
      next();
    });
  },
  createUser: async (req, res, next) => {
    createUser(req.body, (statusCode, data) => {
      (req.statusCode = statusCode), (req.result = data);
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
