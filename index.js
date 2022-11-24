const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3004;
//const userRoute = require("./routes/user");
// const roleRouter = require("./routes/role");
const routes=require("./routes")
const app = express();
app.use(cors());
app.use(express.json());
// app.use("/", userRoute);
// app.use("/", roleRouter);
app.use('/',routes.user.route);
app.use('/',routes.role.route);
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
