const { createRole, changeRole } = require('../services/role.service');

module.exports = {
    createRoles: (req, res, next) => {
        createRole(req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        });
    },
    changeRoles: (req, res, next) => {
        changeRole(req.body, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        });
    }
}