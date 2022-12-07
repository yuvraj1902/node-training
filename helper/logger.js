const bunyan = require('bunyan');
const { v4 } = require('uuid');
const serializers = require('./serializer');

let logger;
const init = (name = 'logger', loggerLevel = 'info') => {
    

    logger = bunyan.createLogger({
        name: name,
        serializers: serializers
    });

    

    logger.getContext = function () {
        return {
            'x-request-id': this.fields['x-request-id']
        };
    };

};




const getInstance = (props = {}) => {
    if (typeof props === 'string') {
        props = JSON.parse(props);
    }
    const properties = {
        'x-request-id': v4(),
        ...props
    };
    // console.log("arvind", logger.child(properties));  
    return logger.child(properties);       
};



module.exports = {
    init,
    getInstance
};
