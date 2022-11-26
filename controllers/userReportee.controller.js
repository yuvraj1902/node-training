const models = require("../models");
const { addReportee } = require('../services/userReportee.service');

module.exports = {

    addReportee: async (req, res, next) => {
        addReportee(req.params.id, req.body.id, (statusCode, result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        });
    }
}