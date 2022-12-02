<<<<<<< HEAD
const { commonErrorHandler } = require("../helper/errorHandeler");
=======
const { createUser,
    deactivateUser,
    userInfo,
    resetUserPassword,
    forgetPassword,
    enableUser,
    userDetail } = require('../services/user.service');

const { commonErrorHandler } = require('../helper/errorHandler')
const userService = require('../services/user.service');
>>>>>>> 05818d1 (Refactor userAddReportee and adminAddReportee API)

const userService = require("../services/user.service");

const loginUser = async (req, res, next) => {
    try {
    const { body: payload } = req;
    const data = await userService.loginUser(payload);
    res.data = data;
    next();
    } catch (error) {
    commonErrorHandler(req, res, error.message, 400);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await createUser.createUser(payload);
    res.data = data;
    next();

  } catch (error)
  {
    commonErrorHandler(req, res, error.message, 400);
  }
}

module.exports = {
  loginUser,
  createUser
}
