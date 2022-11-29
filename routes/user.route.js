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
    controllers.User.loginUsers,
    genericResponse.sendResponse
);
router.post(
    '/createUser',
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

<<<<<<< HEAD

router.post("/login", validator.userValidator.loginSchema, controllers.User.loginUsers, genericResponse.sendResponse);
router.post("/createUser", checkToken, verifyUser, validator.userValidator.createUserSchema, controllers.User.createUser, genericResponse.sendResponse);
router.delete("/deactiveUser/:id", checkToken, verifyUser, controllers.User.deactiveUsers, genericResponse.sendResponse);
router.get("/userInfo", checkToken, controllers.User.getUserInfo, genericResponse.sendResponse);
router.post("/resetUserPassword",validator.userValidator.resetPasswordQuerySchema,validator.userValidator.resetUserPasswordSchema,controllers.User.resetUserPassword, genericResponse.sendResponse);
router.post("/forgetpassword", validator.userValidator.forgetPassword, controllers.User.forgetPassword, genericResponse.sendResponse);
router.get("/users",checkToken, verifyUser, controllers.User.getAllUsers, genericResponse.sendResponse);
module.exports = router;
=======
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
    '/userInfo',
    checkToken,
    controllers.User.getUserInfo,
    genericResponse.sendResponse
);
router.delete(
    '/resetUserPassword',
    controllers.User.resetUserPassword,
    genericResponse.sendResponse
);
router.delete(
    '/deactivateUser',
    checkToken,
    verifyUser,
    validator.userValidator.deactivateUserSchema,
    controllers.User.deactivateUsers,
    genericResponse.sendResponse
);
router.patch(
    '/enableUser',
    checkToken,
    verifyUser,
    validator.userValidator.enableUserSchema,
    controllers.User.enableUsers,
    genericResponse.sendResponse
);
router.get(
    '/userDetails',
    checkToken,
    verifyUser,
    validator.userValidator.userDetailsSchema,
    controllers.User.userDetails,
    genericResponse.sendResponse
);
module.exports = router;
>>>>>>> feature/temp
