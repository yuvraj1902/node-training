const express = require("express");
const cors = require("cors");
const userRouter = require('./routes/index');
const roleRouter=require("./routes/role.route")

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', userRouter);
app.use('/',roleRouter)

app.listen(PORT = 3001, () => console.log(`Listening on port: ${PORT}`));

