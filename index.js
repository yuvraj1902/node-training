require('dotenv').config();
const expressWiston = require('express-winston');
const { transports, format } = require('winston');

const app = require('./app');
const { sequelize } = require('./models');
const { connect } = require('./utility/redis');

const startServer = async function () {
  try {
    await sequelize.authenticate();
    console.log('... Microservice db ✔');

    app.use(expressWiston.logger({
      transports: [
        new transports.Console(),
        new transports.File({
          level: 'warn',
          filename: 'logsWarnings.log'
        }),
        new transports.File({
          level: 'error',
          filename: 'logsErrors.log'
        })
      ],
      format: format.json()
    }));

    await connect();
    app.listen(process.env.SERVER_PORT);
    console.log(`--- Server started on ${process.env.SERVER_PORT} ---\n\n`);
  } catch (err) {
    console.log('server setup failed', err);
    console.log('Error: ', err.message);
  }
};

startServer();
