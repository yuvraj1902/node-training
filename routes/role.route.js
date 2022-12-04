const { Router } = require("express");
const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require("../validators");
const genericResponse = require("../helper/genericResponse");
const router = Router();
router.post(
  "/create-role",
  checkToken,
  verifyUser,
  validator.roleValidator.createRoleSchema,
  controllers.Role.createRoles,
  genericResponse.sendResponse
);
router.patch(
  "/change-role",
  checkToken,
  verifyUser,
  validator.roleValidator.changeRoleSchema,
  controllers.Role.changeRoles,
  genericResponse.sendResponse
);
