const { Router } = require("express");
const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const validator = require('../validators');
const genericResponse = require('../helper/generic-response');
const router = Router();

router.post("/login", validator.userValidator.loginSchema, controllers.User.loginUsers, genericResponse.sendResponse);
router.post("/createUser", controllers.User.createUser);

module.exports = router;
