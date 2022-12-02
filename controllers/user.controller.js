const { commonErrorHandler } = require("../helper/errorHandeler");

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


module.exports = {
    loginUser
}
