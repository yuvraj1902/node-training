const routes = require("./routes");
const app = require("./routes/index");
const PORT = 3004;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));