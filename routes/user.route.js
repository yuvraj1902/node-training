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
    controllers.User.loginUser,
    genericResponse.sendResponse
);
router.post(
    '/refresh-token',
    validator.userValidator.refreshTokenSchema,
    controllers.User.refreshToken,
    genericResponse.sendResponse
);
router.post(
    '/logout',
    validator.userValidator.refreshTokenSchema,
    controllers.User.logoutUser,
    genericResponse.sendResponse
);

router.post(
    '/registration',
    validator.userValidator.registrationSchema,
    controllers.User.registration,
    genericResponse.sendResponse
);

router.post(
    '/forget-password',
    validator.userValidator.forgetPassword,
    controllers.User.forgetPassword,
    genericResponse.sendResponse
);

router.get(
    '/user-details',
    checkToken,
    controllers.User.getUserInfo,
    genericResponse.sendResponse
);

router.post(
    '/reset-password',
    checkToken,
    validator.userValidator.resetPasswordSchema,
    controllers.User.resetPassword,
    genericResponse.sendResponse
);

router.post(
    '/reset-password/:token',
    validator.userValidator.resetPasswordSchemaToken,
    validator.userValidator.resetPasswordSchema,
    controllers.User.resetPasswordByLink,
    genericResponse.sendResponse
);

router.post(
    "/add-reportee",
    checkToken,
    validator.reporteeValidator.userReporteeSchema,
    controllers.UserReportee.userAddReportee,
    genericResponse.sendResponse
);
router.delete(
    "/delete-reportee",
    checkToken,
    validator.reporteeValidator.userReporteeSchema,
    controllers.UserReportee.userDeleteReportee,
    genericResponse.sendResponse
);


module.exports = router;
