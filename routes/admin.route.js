const { Router } = require("express");
const router = Router();

const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require("../validators");
const genericResponse = require("../helper/generic-response");



router.post(
    '/create-user',
    checkToken,
    verifyUser,
    validator.userValidator.createUserSchema,
    controllers.user.createUser,
    genericResponse.sendResponse
);

router.get(
    '/users',
    checkToken,
    verifyUser,
    controllers.user.getAllUsers,
    genericResponse.sendResponse
);


router.post(
  "/add-reportee",
  checkToken,
  verifyUser,
  validator.reporteeValidator.adminReporteeSchema,
  controllers.userReportee.adminAddReportee,
  genericResponse.sendResponse
);

router.delete(
  "/delete-reportee",
  checkToken,
  verifyUser,
  validator.reporteeValidator.adminReporteeSchema,
  controllers.userReportee.adminDeleteReportee,
  genericResponse.sendResponse
);

router.get(
    '/user-details',
    checkToken,
    verifyUser,
    validator.userValidator.userDetailsSchema,
    controllers.user.adminUserDetail,
    genericResponse.sendResponse
);


router.post(
    '/reset-user-password',
    checkToken,
    verifyUser,
    validator.userValidator.adminResetPasswordSchema,
    controllers.user.adminResetPassword,
    genericResponse.sendResponse
);


router.delete(
    '/deactivate-user',
    checkToken,
    verifyUser,
    validator.userValidator.deactivateUserSchema,
    controllers.user.deactivateUser,
    genericResponse.sendResponse
);
router.patch(
    '/enable-user',
    checkToken,
    verifyUser,
    validator.userValidator.enableUserSchema,
    controllers.user.enableUser,
    genericResponse.sendResponse
);


router.post(
  "/assign-designation",
  checkToken,
  verifyUser,
  validator.designationValidator.designationSchema,
  controllers.designation.assignDesignation,
  genericResponse.sendResponse
);
router.post(
  "/deactive-designation",
  checkToken,
  verifyUser,
  validator.designationValidator.designationSchema,
  controllers.designation.deactiveDesignation,
  genericResponse.sendResponse
);


module.exports = router;
