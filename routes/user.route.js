const { Router } = require('express');
const controllers = require('../controllers');
const { checkToken } = require('../middlewares/auth');
const { verifyUser } = require('../middlewares/user-verification');
const validator = require('../validators')
const genericResponse = require('../helper/generic-response')
const router = Router();


router.post(
    '/login',
    validator.userValidator.loginSchema,
    controllers.user.loginUser,
    genericResponse.sendResponse
);
router.post(
    '/refresh-token',
    validator.userValidator.refreshTokenSchema,
    controllers.user.refreshToken,
    genericResponse.sendResponse
);
router.post(
    '/logout',
    validator.userValidator.refreshTokenSchema,
    controllers.user.logoutUser,
    genericResponse.sendResponse
);

router.post(
    '/registration',
    validator.userValidator.registrationSchema,
    controllers.user.registration,
    genericResponse.sendResponse
);

router.post(
    '/forget-password',
    validator.userValidator.forgetPassword,
    controllers.user.forgetPassword,
    genericResponse.sendResponse
);

router.get(
    '/user-details',
    checkToken,
    controllers.user.userDetail,
    genericResponse.sendResponse
);

router.post(
    '/reset-password',
    checkToken,
    validator.userValidator.resetPasswordSchema,
    controllers.user.resetPassword,
    genericResponse.sendResponse
);

router.post(
    '/reset-password/:token',
    validator.userValidator.resetPasswordSchemaToken,
    validator.userValidator.resetPasswordSchema,
    controllers.user.resetPasswordByLink,
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
  "/add-reportee",
  checkToken,
  validator.reporteeValidator.userReporteeSchema,
  controllers.userReportee.userAddReportee,
  genericResponse.sendResponse
);

router.delete(
  "/delete-reportee",
  checkToken,
  validator.reporteeValidator.userReporteeSchema,
  controllers.userReportee.userDeleteReportee,
  genericResponse.sendResponse
);
module.exports = router;
