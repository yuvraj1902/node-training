const { commonErrorHandler } = require('../helper/errorHandler');
const designationService = require('../services/designation.service');

const assignDesignation = async (req, res, next) => {
    try {
        const { body: payload } = req;
        const data = await designationService.assignDesignation(payload);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

const deactiveDesignation = async (req, res, next) => {
    try {
        const { body: payload } = req;
        const data = await designationService.deactiveDesignation(payload);
        res.data = data;
        next();
    } catch (error) {
        console.log('-----', error);
        console.log('getModalFieldData error:', error);
        commonErrorHandler(req, res, error.message, 400, error);
    }
}

module.exports = {
    assignDesignation,
    deactiveDesignation
}