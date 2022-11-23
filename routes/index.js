const { Router } = require("express");
const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const router = Router();

router.post("/login", controllers.User.loginUser);
router.post("/createUser", checkToken, controllers.User.createUser);
router.get("/users/:id", checkToken, controllers.User.userDetailsById);
router.get("/filterUsers", checkToken, verifyUser, controllers.User.filterUsers);

module.exports = router;
