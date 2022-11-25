const express = require("express");
const cors = require("cors");
const userRouter=require("./routes/user.route")
const roleRouter=require("./routes/role.route")
const app = express();
app.use(cors());  
app.use(express.json());
app.use('/',userRouter);
app.use("/",roleRouter)
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

