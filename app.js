const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const routes = require('./routes');

// const { ReqResLoggerMiddleware } = require('./shared/middlewares');
// const { commonErrorHandler } = require('./shared/toolbox/errorHandler');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '10mb',
    extended: true,
    parameterLimit: 50000
  })
);
// Enable cors support to accept cross origin requests
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

// Enable helmet js middlewares to configure secure headers
app.use(helmet());

// Enable gzip compression module for REST API
app.use(compression());

// Disble x-powered-by header to hide server side technology
app.disable('x-powered-by');

// // Request Response logging
// app.use(ReqResLoggerMiddleware);

app.use('/health', (_req, res) => {
  res.send({ message: 'Application runing successfully!' });
});

// REST API entry point
routes.registerRoutes(app);

// 404 Error Handling
app.use((req, res) => {
    const message = 'Invalid endpoint';
    res.status(404).json({message});
});

module.exports = app;
