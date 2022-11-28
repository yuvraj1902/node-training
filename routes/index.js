const express = require("express");
const cors = require("cors");
const userRoutes = require("./user.route");
// const roleRoutes = require("./role.route");
const userReporteeRoutes = require("./userReportee.route");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", userRoutes);
// app.use("/", roleRoutes);
app.use("/", userReporteeRoutes);


module.exports = app;






















































// const { Router } = require("express");
// const controllers = require("../controllers");
// const { checkToken } = require("../middlewares/auth");
// const { verifyUser } = require("../middlewares/user-verification");
// const validator = require('../validators');
// const genericResponse = require('../helper/generic-response');
// const router = Router();

// router.post("/login", validator.userValidator.loginSchema, controllers.User.loginUsers, genericResponse.sendResponse);
// router.post("/createUser", checkToken, verifyUser, validator.userValidator.createUserSchema, controllers.User.createUser, genericResponse.sendResponse);
// router.delete("/deactiveUser/:id", checkToken, verifyUser, controllers.User.deactiveUsers, genericResponse.sendResponse);
// router.post('/addReportee/:id', checkToken, validator.addReporteeValidator.addReporteeSchema, controllers.UserReportee.addReportee, genericResponse.sendResponse);

// module.exports = router;
