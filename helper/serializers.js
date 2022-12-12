const bunyan = require('bunyan');

function maskSensitiveData(body) {
  const SENSITIVE_FIELDS = ['password', 'email', 'token'];
  const MASK = '****';

  if (!body) {
    return body;
  }
  try {
    const sanitizedBody = JSON.parse(JSON.stringify(body));
    SENSITIVE_FIELDS.forEach(field => {
      if (!sanitizedBody[field]) {
        return;
      }
      sanitizedBody[field] = MASK;
    });
    return sanitizedBody;
  } catch (err) {
    return body;
  }
}

function stringify(value) {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

module.exports = {
  req: function reqSerializer(req) {
    if (!req) {
      return req;
    }

    let body = maskSensitiveData(req.body);
    let query = maskSensitiveData(req.query);

    return {
      method: req.method,
      originalUrl: req.originalUrl,
      url: req.url,
      body: stringify(body),
      query: stringify(query),
      headers: req.headers,
      httpVersion: req.httpVersion,
      remoteAddress: req.socket.remoteAddress,
      remotePort: req.socket.remotePort
    };
  },
  res: function resSerializer(res) {
    if (!res) {
      return res;
    }

    return {
      statusCode: res.statusCode
    };
  },
  err: bunyan.stdSerializers.err
};
