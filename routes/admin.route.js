const { Router } = require("express");
const router = Router();

const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require("../validators");
const genericResponse = require("../helper/generic-response");




router.post(
  "/add-reportee",
  checkToken,
  verifyUser,
  validator.reporteeValidator.adminReporteeSchema,
  controllers.UserReportee.adminAddReportee,
  genericResponse.sendResponse
);

router.delete(
  "/delete-reportee",
  checkToken,
  verifyUser,
  validator.reporteeValidator.adminReporteeSchema,
  controllers.UserReportee.adminDeleteReportee,
  genericResponse.sendResponse
);

router.post(
    '/create-user',
    checkToken,
    verifyUser,
    validator.userValidator.createUserSchema,
    controllers.User.createUser,
    genericResponse.sendResponse
);

router.get(
    '/users',
    checkToken,
    verifyUser,
    controllers.User.getAllUsers,
    genericResponse.sendResponse
);

router.delete(
    '/deactivate-user',
    checkToken,
    verifyUser,
    validator.userValidator.deactivateUserSchema,
    controllers.User.deactivateUser,
    genericResponse.sendResponse
);


router.patch(
    '/enable-user',
    checkToken,
    verifyUser,
    validator.userValidator.enableUserSchema,
    controllers.User.enableUser,
    genericResponse.sendResponse
);

router.post(
    '/reset-user-password',
    checkToken,
    verifyUser,
    validator.userValidator.adminResetPasswordSchema,
    controllers.User.adminResetPassword,
    genericResponse.sendResponse
);

router.get(
    '/user-details',
    checkToken,
    verifyUser,
    validator.userValidator.userDetailsSchema,
    controllers.User.getUserDetail,
    genericResponse.sendResponse
);

router.post(
  '/assign-designation',
  checkToken,
  verifyUser,
  validator.designationValidator.designationSchema,
  controllers.Designation.assignDesignation,
  genericResponse.sendResponse
);
router.post(
  '/deactive-designation',
  checkToken,
  verifyUser,
  validator.designationValidator.designationSchema,
  controllers.Designation.deactiveDesignation,
  genericResponse.sendResponse
);


module.exports = router;
