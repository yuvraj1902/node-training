require("dotenv").config();
const app = require("./app")
const { sequelize } = require("./models")

const startServer = async function () {
  try {
    await sequelize.authenticate();
    console.log("... Microservice db ✔");

    app.listen(process.env.SERVER_PORT);
    console.log(`--- Server started on ${process.env.SERVER_PORT} ---\n\n`);
  } catch (err) {
    console.log("server setup failed", err.message);
   
  }
};

startServer();
