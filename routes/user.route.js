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
    controllers.User.refreshToken,
    genericResponse.sendResponse
);
router.delete(
    '/logout',
    controllers.User.logoutUser,
    genericResponse.sendResponse
)
router.post(
    '/create-user',
    checkToken,
    verifyUser,
    validator.userValidator.createUserSchema,
    controllers.User.createUser,
    genericResponse.sendResponse
);
router.post(
    '/registration',
    validator.userValidator.createUserSchema,
    controllers.User.registration,
    genericResponse.sendResponse
);

router.post(
    '/forgetpassword',
    validator.userValidator.forgetPassword,
    controllers.User.forgetPassword,
    genericResponse.sendResponse
);
router.get(
    '/users',
    checkToken,
    verifyUser,
    controllers.User.getAllUsers,
    genericResponse.sendResponse
);
router.get(
    '/user-info',
    checkToken,
    controllers.User.getUserInfo,
    genericResponse.sendResponse
);
router.post(
    '/reset-user-password',
    validator.userValidator.resetPasswordQuerySchema,
    validator.userValidator.resetUserPasswordSchema,
    controllers.User.resetPassword,
    genericResponse.sendResponse
);
router.delete(
    '/deactivate-user',
    checkToken,
    verifyUser,
    validator.userValidator.deactivateUserSchema,
    controllers.User.deactivateUsers,
    genericResponse.sendResponse
);
router.patch(
    '/enable-user',
    checkToken,
    verifyUser,
    validator.userValidator.enableUserSchema,
    controllers.User.enableUsers,
    genericResponse.sendResponse
);
router.get(
    '/user-details',
    checkToken,
    verifyUser,
    validator.userValidator.userDetailsSchema,
    controllers.User.userDetails,
    genericResponse.sendResponse
);
module.exports = router;
