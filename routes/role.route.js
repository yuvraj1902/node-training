const { Router } = require("express");
const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require('../validators');
const genericResponse = require('../helper/generic-response');
const router = Router();


router.post("/createRole",checkToken,verifyUser,validator.roleValidator.roleSchema,controllers.Role.createRoles,genericResponse.sendResponse);


module.exports = router;
