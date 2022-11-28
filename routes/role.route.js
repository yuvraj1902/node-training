const { Router } = require("express");
const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require('../validators');
const genericResponse = require('../helper/generic-response');
const router = Router();


router.post("/createRole",checkToken,verifyUser,validator.roleValidator.createRoleSchema,controllers.Role.createRoles,genericResponse.sendResponse);
router.patch("/changeRole",checkToken,verifyUser,validator.roleValidator.changeRoleSchema,controllers.Role.changeRoles,genericResponse.sendResponse);

module.exports = router;
