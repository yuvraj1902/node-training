const express = require("express");
const cors = require("cors");
const userRouter = require('./routes/index');
const routes = require("./routes")

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', routes);

app.listen(PORT = 3001, () => console.log(`Listening on port: ${PORT}`));

module.exports = app;