const models = require("../models");


const addReportee = async (managerId, reporteeId) => {
    // check for valid request
    const existingManager = await models.User.findOne({ where: { id: managerId }, include: models.Designation });
    if (!existingManager) throw new Error('User not found');

    const existingReportee = await models.User.findOne({ where: { id: reporteeId }, include: models.Designation });
    if (!existingReportee) throw new Error('User not found');

    if (
        existingManager.Designations[0].designation_code <
        existingReportee.Designations[0].designation_code
    ) {
        const existingField = await models.UserReporteeMapping.findOne({
            where: {
                manager_id: managerId,
                reportee_id: reporteeId,
            },
        });
        if (existingField)
            throw new Error('Already existing relation');
        const reporteeAdded = await models.UserReporteeMapping.create({
            manager_id: managerId,
            reportee_id: reporteeId,
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

const deleteReportee = async (managerId, reporteeId, callback) => {
        // check for valid request
    const existingManager = await models.User.findOne({ where: { id: managerId }, include: models.Designation });
    if (!existingManager) throw new Error('User not found');

    const existingReportee = await models.User.findOne({ where: { id: reporteeId }, include: models.Designation });
    if (!existingReportee) throw new Error('User not found');

    if (existingManager.Designations[0].designation_code < existingReportee.Designations[0].designation_code) {
        const existingField = await models.UserReporteeMapping.findOne({
            where: {
                manager_id: managerId,
                reportee_id: reporteeId
            }
        })
        if (!existingField) throw new Error(`Not Found`);
        const reporteeDeleted = await models.UserReporteeMapping.destroy({
            where: {
                manager_id: managerId,
                reportee_id: reporteeId
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
    const managerId = user.dataValues.id;
    const { reporteeId } = payload;

    return addReportee(managerId, reporteeId);
}

const adminAddReportee = async (payload) => {
    // const { manager_id, reportee_id } = payload;
    const { managerId, reporteeId } = payload;

    return addReportee(managerId, reporteeId);
}

const userDeleteReportee = async (payload, user) => {
    const managerId = user.dataValues.id;
    const { reporteeId } = payload;

    return deleteReportee(managerId, reporteeId);
}
const adminDeleteReportee = async (payload) => {
    const { managerId, reporteeId } = payload;

    return deleteReportee(managerId, reporteeId);
}

module.exports = {
    addReportee,
    deleteReportee,
    userAddReportee,
    adminAddReportee,
    userDeleteReportee,
    adminDeleteReportee
}
