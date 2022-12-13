const logger = require('../utility/logger');
const { getReasonPhrase } = require('../helper/commonFunctions.helper');

function logRequest(req) {
  let meta = {
    logType: 'REQUEST',
    req
  };


  req.logger.info.call(req.logger, meta, `${req.method} ${req.originalUrl}`);
  if (process.env.STDOUT_LOG === 'true') {
    console.log(`\n`);
  }
}

function logResponse(req, res) {
  res.removeListener('finish', logResponse);
  res.removeListener('close', logResponse);

  let endTime = process.hrtime(req.logger.fields.startTime);
  let responseTime = endTime[1] / 1000000;

  const meta = {
    logType: 'RESPONSE',
    responseTime,
    req,
    res
  };

  if (req.user) {
    meta.uid = { userId: req.user.userId };
  }

  if (req.error) {
    req.logger.error(req.error);
    if (process.env.STDOUT_LOG === 'true') {
      console.log(`\n`);
    }
  }

  let message = `${req.method} -- ${req.originalUrl} -- ${getReasonPhrase(res.statusCode)}`;
  req.logger.info.call(req.logger, meta, message);
  if (process.env.STDOUT_LOG === 'true') {
    console.log(`\n`);
  }
}

module.exports = (req, res, next) => {
  const props = {
    startTime: process.hrtime(),
    time: new Date()
  };

  if (req.headers['x-request-id']) {
    props['x-request-id'] = req.headers['x-request-id'];
  }

  req.logger = logger.getInstance(props);


  if (req.originalUrl === '/health') {
    return next();
  }

  
  logRequest(req);

  res.on('finish', logResponse.bind(null, req, res));

  return next();
};
