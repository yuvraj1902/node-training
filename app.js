const express = require("express");
const cors = require("cors");
const routes = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', routes);

app.listen(PORT = 3001, () => console.log(`Listening on port: ${PORT}`));

module.exports = app;