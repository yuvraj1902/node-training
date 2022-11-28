const { Router } = require("express");
const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require('../validators');
const genericResponse = require('../helper/generic-response');
const router = Router();

router.post("/createDesignation",checkToken,verifyUser,validator.designationValidator.createDesignationSchema,controllers.Designation.createDesignations,genericResponse.sendResponse);
router.patch("/changeDesignation",checkToken,verifyUser,validator.designationValidator.changeDesignationSchema,controllers.Designation.changeDesignations,genericResponse.sendResponse);


module.exports = router;
