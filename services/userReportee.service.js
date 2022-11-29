const models = require("../models");


const addReportee = async (manager_id, reportee_id) => {
    // check for valid request
    const existingManager = await models.User.findOne({ where: { id: manager_id }, include: models.Designation });
    if (!existingManager) throw new Error('User not found');

    const existingReportee = await models.User.findOne({ where: { id: reportee_id }, include: models.Designation });
    if (!existingReportee) throw new Error('User not found');

    if (
        existingManager.Designations[0].designation_code <
        existingReportee.Designations[0].designation_code
    ) {
        const existingField = await models.UserReporteeMapping.findOne({
            where: {
                manager_id: manager_id,
                reportee_id: reportee_id,
            },
        });
        if (existingField)
            throw new Error('Already existing relation');
        const reporteeAdded = await models.UserReporteeMapping.create({
            manager_id: manager_id,
            reportee_id: reportee_id,
        });
        return {
            data: {
                manager_id: reporteeAdded.manager_id,
                reportee_id: reporteeAdded.reportee_id
            }
        }
    } else {
        throw new Error('This relation is not valid');
    }
} 

const deleteReportee = async (manager_id, reportee_id, callback) => {
        // check for valid request
    const existingManager = await models.User.findOne({ where: { id: manager_id }, include: models.Designation });
    if (!existingManager) throw new Error('User not found');

    const existingReportee = await models.User.findOne({ where: { id: reportee_id }, include: models.Designation });
    if (!existingReportee) throw new Error('User not found');

    if (existingManager.Designations[0].designation_code < existingReportee.Designations[0].designation_code) {
        const existingField = await models.UserReporteeMapping.findOne({
            where: {
                manager_id: manager_id,
                reportee_id: reportee_id
            }
        })
        if (!existingField) throw new Error(`Not Found`);
        const reporteeDeleted = await models.UserReporteeMapping.destroy({
            where: {
                manager_id: manager_id,
                reportee_id: reportee_id
            }
        })
        return {
            message: `Relation successfully deleted`
        }
    } else {
        throw new Error(`Unprocessable`);
    }
  
};




const userAddReportee = async (payload, user) => {
    const manager_id = user.dataValues.id;
    const { reportee_id } = payload;

    return addReportee(manager_id, reportee_id);
}

const adminAddReportee = async (payload) => {
    const { manager_id, reportee_id } = payload;

    return addReportee(manager_id, reportee_id);
}

const userDeleteReportee = async (payload, user) => {
    const manager_id = user.dataValues.id;
    const { reportee_id } = payload;

    return deleteReportee(manager_id, reportee_id);
}
const adminDeleteReportee = async (payload) => {
    const { manager_id, reportee_id } = payload;

    return deleteReportee(manager_id, reportee_id);
}

module.exports = {
    addReportee,
    deleteReportee,
    userAddReportee,
    adminAddReportee,
    userDeleteReportee,
    adminDeleteReportee
}

