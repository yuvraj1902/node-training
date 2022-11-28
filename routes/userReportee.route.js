const { Router } = require("express");
const router = Router();

const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require("../validators")
const genericResponse = require("../helper/generic-response")


router.post('/addReportee/:id', validator.addReporteeValidator.addReporteeSchema, controllers.UserReportee.addReportee, genericResponse.sendResponse);
module.exports = router;