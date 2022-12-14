const { Router } = require("express");

const controllers = require("../controllers");
const { checkAccessToken } = require('../middlewares/auth');
const { verifyUser } = require("../middlewares/user-verification");
const validator = require("../validators");
const genericResponse = require("../helper/generic-response");

const router = Router();

router.post(
  '/create-user',
  checkAccessToken,
  verifyUser,
  validator.userValidator.createUserSchema,
  controllers.User.createUser,
  genericResponse.sendResponse
);

router.delete(
  '/deactivate-user',
  checkAccessToken,
  verifyUser,
  validator.userValidator.deactivateUserSchema,
  controllers.User.deactivateUser,
  genericResponse.sendResponse
);
router.patch(
  '/enable-user',
  checkAccessToken,
  verifyUser,
  validator.userValidator.enableUserSchema,
  controllers.User.enableUser,
  genericResponse.sendResponse
);

router.get(
  '/user-details/:userId',
  checkAccessToken,
  verifyUser,
  validator.userValidator.userDetailsSchema,
  controllers.User.adminUserDetail,
  genericResponse.sendResponse
);

router.post(
  '/reset-user-password',
  checkAccessToken,
  verifyUser,
  validator.userValidator.adminResetPasswordSchema,
  controllers.User.adminResetPassword,
  genericResponse.sendResponse
);


router.get(
  '/users',
  checkAccessToken,
  verifyUser,
  controllers.User.getAllUsers,
  genericResponse.sendResponse
);
router.post(
  '/assign-designation',
  checkAccessToken,
  verifyUser,
  validator.designationValidator.designationSchema,
  controllers.Designation.assignDesignation,
  genericResponse.sendResponse
);
router.delete(
  '/deactivate-designation',
  checkAccessToken,
  verifyUser,
  validator.designationValidator.designationSchema,
  controllers.Designation.deactivateDesignation,
  genericResponse.sendResponse
);

router.post(
  "/add-reportee",
  checkAccessToken,
  verifyUser,
  validator.reporteeValidator.adminReporteeSchema,
  controllers.UserReportee.adminAddReportee,
  genericResponse.sendResponse
);
router.delete(
  "/delete-reportee",
  checkAccessToken,
  verifyUser,
  validator.reporteeValidator.adminReporteeSchema,
  controllers.UserReportee.adminDeleteReportee,
  genericResponse.sendResponse
);
module.exports = router;
