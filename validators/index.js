const userValidator = require('./user.validator');
const roleValidator = require('./role.validator');
const reporteeValidator = require('./userReportee.validator');
const designationValidator = require('./designation.validator');

module.exports = {
    userValidator,
    roleValidator,
    reporteeValidator,
    designationValidator
}