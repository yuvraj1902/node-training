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
        const existingField = await models.UserReportee.findOne({
            where: {
                manager_id: manager_id,
                reportee_id: reportee_id,
            },
        });
        if (existingField)
            throw new Error('Already existing relation');
        const reporteeAdded = await models.UserReportee.create({
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
    try {
        // check for valid request
        const existingManager = await models.User.findOne({ where: { id: manager_id }, include: models.Designation });
        if (!existingManager) return callback(404, { response: `User not found` });

        const existingReportee = await models.User.findOne({ where: { id: reportee_id }, include: models.Designation });
        if (!existingReportee) return callback(404, { response: `User not found` });

        if (existingManager.Designations[0].designation_code < existingReportee.Designations[0].designation_code) {
            const existingField = await models.UserReportee.findOne({
                where: {
                    manager_id: manager_id,
                    reportee_id: reportee_id
                }
            })
            if (!existingField) return callback(404, { response: `Not Found` });
            const reporteeDeleted = await models.UserReportee.destroy({
                where: {
                    manager_id: manager_id,
                    reportee_id: reportee_id
                }
            })
            return callback(200, { response: `Relation successfully deleted` });
        } else {
            return callback(422, { message: `Unprocessable` });
        }

    } catch (err) {
        return callback(500, { error: `Something went wrong!` });
    }

}




const userAddReportee = async (payload, user) => {
    const manager_id = user.dataValues.id;
    const { reportee_id } = payload;

    return addReportee(manager_id, reportee_id);
}

const adminAddReportee = async (payload) => {
    const { manager_id, reportee_id } = payload;

    return addReportee(manager_id, reportee_id);
}

const userDeleteReportee = async (body, user, callback) => {
    const manager_id = user.dataValues.id;
    const reportee_id = body.reportee_id;

    return deleteReportee(manager_id, reportee_id, callback);
}
const adminDeleteReportee = async (body, callback) => {
    const { manager_id, reportee_id } = body;

    return deleteReportee(manager_id, reportee_id, callback);
}

module.exports = {
    addReportee,
    deleteReportee,
    userAddReportee,
    adminAddReportee,
    userDeleteReportee,
    adminDeleteReportee
}

