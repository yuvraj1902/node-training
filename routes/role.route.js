const { Router } = require("express");
const controllers = require("../controllers");
const { checkToken } = require("../middlewares/auth");
const { verifyUser } = require("../middlewares/user-verification");
const router = Router();


router.post("/createRole", checkToken,verifyUser, controllers.Role.createRole);


module.exports = router;