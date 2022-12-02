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
module.exports = router;
