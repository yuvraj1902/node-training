const express = require("express");
const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const router = express.Router();

//router.post("/login", controllers.User.loginUser);
router.post("/createUser", checkToken,verifyUser, controllers.User.createUser);
//router.get("/users/:id", checkToken, controllers.User.userDetailsById);
//router.get("/filterUsers", checkToken, verifyUser, controllers.User.filterUsers);
//router.get("/deactivateUser", checkToken, verifyUser, controllers.User.deactivateUser);

module.exports = router;
