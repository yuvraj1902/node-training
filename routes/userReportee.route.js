const { Router } = require("express");
const router = Router();

const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require("../validators")
const genericResponse = require("../helper/generic-response")


router.post('/userAddReportee', checkToken, validator.reporteeValidator.userReporteeSchema, controllers.UserReportee.userAddReportee, genericResponse.sendResponse);
router.delete('/userDeleteReportee', checkToken, validator.reporteeValidator.userReporteeSchema, controllers.UserReportee.userDeleteReportee, genericResponse.sendResponse);
router.post('/adminAddReportee', checkToken, verifyUser, validator.reporteeValidator.adminReporteeSchema, controllers.UserReportee.adminAddReportee, genericResponse.sendResponse)
router.delete('/adminDeleteReportee', checkToken, verifyUser, validator.reporteeValidator.adminReporteeSchema, controllers.UserReportee.adminDeleteReportee, genericResponse.sendResponse);
module.exports = router;