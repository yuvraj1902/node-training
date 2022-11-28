const { createUser, loginUser, deactivateUser } = require("../services/user.service");


module.exports = {
<<<<<<< HEAD

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

    }
=======
  createUser: async (req, res, next) => {
    createUser(req.body, (data, result) => {
      (req.body = data), (req.statusCode = result);
      next();
    });
  },
  deleteUser: async (req, res, next) => {
    deleteUser(req, (data, result) => {
      
    });
  }
>>>>>>> 13f241f (bugfix/create-user-API)
};




