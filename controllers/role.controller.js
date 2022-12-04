const { commonErrorHandler } = require("../helper/errorHandeler");
const roleService = require("../services/role.service");

const createRoles = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await roleService.createRole(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400);
  }
};
const changeRoles = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await roleService.changeRole(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400);
  }
};
module.exports = {
  createRoles,
  changeRoles
};
