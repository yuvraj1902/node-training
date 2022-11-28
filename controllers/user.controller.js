const { createUser } = require("../services/user.service");

module.exports = {
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
};
