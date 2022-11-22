const { Router } = require("express");
const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const router = Router();

router.post("/login", controllers.User.loginUser);
router.post("/createUser",controllers.User.createUser);

module.exports = router;
