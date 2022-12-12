const { Router } = require('express');

const controllers = require('../controllers');
const { checkRefreshToken, checkAccessToken } = require('../middlewares/auth');
const validator = require('../validators')
const genericResponse = require('../helper/generic-response')

const router = Router();


router.post(
    '/login',
    validator.userValidator.loginSchema,
    controllers.User.loginUser,
    genericResponse.sendResponse
);
router.get(
    '/refresh-token',
    checkRefreshToken,
    controllers.User.refreshToken,
    genericResponse.sendResponse
);
router.post(
    '/logout',
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
    checkAccessToken,
    controllers.User.userDetail,
    genericResponse.sendResponse
);

router.post(
    '/reset-password',
    checkAccessToken,
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
    checkAccessToken,
    validator.reporteeValidator.userReporteeSchema,
    controllers.UserReportee.userAddReportee,
    genericResponse.sendResponse
);
router.delete(
    "/delete-reportee",
    checkAccessToken,
    validator.reporteeValidator.userReporteeSchema,
    controllers.UserReportee.userDeleteReportee,
    genericResponse.sendResponse
);


module.exports = router;