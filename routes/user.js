const { Router } = require("express");
const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require("../validators")
const genericResponse = require("../helper/generic-response")
const router = Router();

router.post("/createUser",checkToken,validator.userValidator.createUserSchema,controllers.User.createUser,genericResponse.sendResponse)
module.exports = router;
