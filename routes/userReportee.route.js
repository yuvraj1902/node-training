const { Router } = require("express");
const router = Router();

const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require("../validators")
const genericResponse = require("../helper/generic-response")


<<<<<<< HEAD
router.post('/userAddReportee', checkToken, validator.reporteeValidator.userReporteeSchema, controllers.UserReportee.userAddReportee, genericResponse.sendResponse);
router.delete('/userDeleteReportee', checkToken, validator.reporteeValidator.userReporteeSchema, controllers.UserReportee.userDeleteReportee, genericResponse.sendResponse);
router.post('/adminAddReportee', checkToken, verifyUser, validator.reporteeValidator.adminReporteeSchema, controllers.UserReportee.adminAddReportee, genericResponse.sendResponse)
router.delete('/adminDeleteReportee', checkToken, verifyUser, validator.reporteeValidator.adminReporteeSchema, controllers.UserReportee.adminDeleteReportee, genericResponse.sendResponse);
=======
// router.post('/addReportee/:id', validator.addReporteeValidator.addReporteeSchema, controllers.UserReportee.addReportee, genericResponse.sendResponse);
router.post('/adminAddReportee', validator.addReporteeValidator.adminAddReporteeSchema, controllers.UserReportee.adminAddReportee, genericResponse.sendResponse)
>>>>>>> 10fea4b (Create addReportee function)
module.exports = router;