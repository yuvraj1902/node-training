const bunyan = require('bunyan');
const { v4 } = require('uuid');
const serializers = require('./serializers');

let logger;
const init = (name = 'logger') => {
  logger = bunyan.createLogger({
    name: name,
    serializers: serializers
  });
};

const getInstance = (props = {}) => {
  if (typeof props === 'string') {
    props = JSON.parse(props);
  }
  const properties = {
    'x-request-id': v4(),
    ...props
  };

  return logger.child(properties);
};

module.exports = {
  init,
  getInstance
};
