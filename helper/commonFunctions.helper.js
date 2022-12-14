const { commonErrorHandler } = require('./errorHandler');


const validateRequest = (req, res, next, schema, requestParamterType) => {

  let requestData = {};
  if (requestParamterType === 'body') {
    requestData = req.body;
  } else if (requestParamterType === 'query') {
    requestData = req.query;
  } else {
    requestData = req.params;
  }

  const { error, value } = schema.validate(requestData);

  if (!error) {
    if (requestParamterType === 'body') {
      req.body = value;
    } else if (requestParamterType === 'query') {
      req.query = value;
    } else {
      req.params = value;
    }
    console.log(value);
    return next();
  }

  const { details } = error;
  const message = details.map(i => i.message).join(',');
  return commonErrorHandler(req, res, message, 422);
};

const getReasonPhrase = function (statusCode) {
  const statusCodeToReasonPhrase = {
    100: 'Continue',
    101: 'Switching Protocols',
    102: 'Processing',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    207: 'Multi-Status',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Moved Temporarily',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    418: "I'm a teapot",
    419: 'Insufficient Space on Resource',
    420: 'Method Failure',
    421: 'Misdirected Request',
    422: 'Unprocessable Entity',
    423: 'Locked',
    424: 'Failed Dependency',
    428: 'Precondition Required',
    429: 'Too Many Requests',
    431: 'Request Header Fields Too Large',
    451: 'Unavailable For Legal Reasons',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
    507: 'Insufficient Storage',
    511: 'Network Authentication Required'
  };

  const result = statusCodeToReasonPhrase[statusCode];
  if (!result) {
    return `Status code does not exist: ${statusCode}`;
  }
  return result;
};


module.exports = {
  validateRequest,
  getReasonPhrase
};
