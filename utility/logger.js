const bunyan = require('bunyan');
const { v4 } = require('uuid');
const serializers = require('../helper/serializer');

let logger;
const init = (name = 'logger', loggerLevel = 'info') => {

    logger = bunyan.createLogger({
        name: name,
        stream: process.stdout,
        level: loggerLevel,
        serializers: serializers
    });

    logger.getContext = function () {
        console.trace("HERE>>>>>>>>>>>>>>>>")
        return {
            'x-request-id': this.fields['x-request-id']
        };                  
    };
};

const getInstance = (props = {}) => {
    console.log(logger.getContext);
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
