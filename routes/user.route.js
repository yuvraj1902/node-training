const { Router } = require("express");
const router = Router();

const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require("../validators")
const genericResponse = require("../helper/generic-response")


router.post("/login", validator.userValidator.loginSchema, controllers.User.loginUsers, genericResponse.sendResponse);
router.post("/createUser", checkToken, verifyUser, validator.userValidator.createUserSchema, controllers.User.createUser, genericResponse.sendResponse);
router.delete("/deactiveUser/:id", checkToken, verifyUser, controllers.User.deactiveUsers, genericResponse.sendResponse);
router.post("/forgetpassword", validator.userValidator.forgetPassword, controllers.User.forgetPassword, genericResponse.sendResponse);
router.get("/users",checkToken, verifyUser, controllers.User.getAllUsers, genericResponse.sendResponse);
module.exports = router;