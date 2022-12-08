const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const routes = require('./routes');
const ReqResLoggerMiddleware = require("./middlewares/req-res-logger");
const { commonErrorHandler } = require("./helper/errorHandler");

const app = express();
app.use(express.json());

// Enable cors support to accept cross origin requests
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

// Enable helmet js middlewares to configure secure headers
app.use(helmet());

// Enable gzip compression module for REST API
app.use(compression());

// Disble x-powered-by header to hide server side technology
app.disable('x-powered-by');


app.use(ReqResLoggerMiddleware);

app.use('/health', (_req, res) => {
  res.send({ message: 'Application runing successfully!' });
});

// REST API entry point
routes.registerRoutes(app);

// 404 Error Handling
app.use((req, res) => {
    const message = 'Invalid endpoint';
    commonErrorHandler(req, res, message, 400);

});

module.exports = app;
