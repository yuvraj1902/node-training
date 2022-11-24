const express = require("express");
const cors = require("cors");
const userRoute = require('./routes/user.route');
const roleRouter=require('./routes/role.route')
const app = express();
app.use(cors());  
app.use(express.json());
app.use('/', userRoute);
app.use('/',roleRouter);

module.exports = app;
