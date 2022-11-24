const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3004;

const app = express();
app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

module.exports = app;