const express = require("express");
const cors = require("cors");
const userRoute = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', userRoute);

const PORT=process.env.PORT || 3004
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

