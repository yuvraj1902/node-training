const userValidator = require('./user.validator');
const designationValidator = require('./designation.validator');
const roleValidator = require('./role.validator');
const reporteeValidator = require('./userReportee.validator');

module.exports = {
    userValidator,
    roleValidator,
    designationValidator,
    reporteeValidator
}