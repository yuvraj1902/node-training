const { Router } = require("express");

const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const validator = require("../validators");
const genericResponse = require("../helper/genericResponse");

const router = Router();

router.post(
  "/login",
  validator.userValidator.loginSchema,
  controllers.User.loginUser,
  genericResponse.sendResponse
);
router.post(
  "/createUser",
  checkToken,
  verifyUser,
  validator.userValidator.createUserSchema,
  controllers.User.createUser,
  genericResponse.sendResponse
);
router.post(
  "/registration",
  validator.userValidator.registrationSchema,
  controllers.User.registration,
  genericResponse.sendResponse
);

module.exports = router;
