const { Router } = require("express");
const router = Router();

const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require("../validators")
const genericResponse = require("../helper/generic-response")


router.post("/login", validator.userValidator.loginSchema, controllers.User.loginUsers, genericResponse.sendResponse);
router.post("/createUser",  validator.userValidator.createUserSchema, controllers.User.createUser, controllers.UserReportee.adminAddReportee, genericResponse.sendResponse);
router.post("/registration",validator.userValidator.createUserSchema,controllers.User.registration,genericResponse.sendResponse)
router.delete("/deactiveUser/:id", checkToken, verifyUser, controllers.User.deactiveUsers, genericResponse.sendResponse);
router.get("/userInfo", checkToken, controllers.User.getUserInfo, genericResponse.sendResponse);
router.delete("/resetUserPassword",controllers.User.resetUserPassword, genericResponse.sendResponse);
router.post("/resetUserPassword",controllers.User.resetUserPassword, genericResponse.sendResponse);
module.exports = router;