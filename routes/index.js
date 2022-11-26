const { Router } = require("express");
const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require('../validators');
const genericResponse = require('../helper/generic-response');
const router = Router();

router.post("/login", validator.userValidator.loginSchema, controllers.User.loginUsers, genericResponse.sendResponse);
router.post("/createUser", controllers.User.createUser);
router.delete("/deactiveUser/:id", checkToken, verifyUser, controllers.User.deactiveUsers, genericResponse.sendResponse);
router.post('/addReportee/:id', checkToken, validator.addReporteeValidator.addReporteeSchema, controllers.UserReportee.addReportee, genericResponse.sendResponse);

module.exports = router;
