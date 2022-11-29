const models = require("../models");

const addReportee = async (manager_id, reportee_id, callback) => {
  try {
    // check for valid request
    const existingManager = await models.User.findOne({
      where: { id: manager_id },
      include: models.Designation,
    });
    if (!existingManager) return callback(404, { response: `User not found` });

    const existingReportee = await models.User.findOne({
      where: { id: reportee_id },
      include: models.Designation,
    });
    if (!existingReportee) return callback(404, { response: `User not found` });

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
        return callback(409, { response: `Already existing relation` });
      const reporteeAdded = await models.UserReportee.create({
        manager_id: manager_id,
        reportee_id: reportee_id,
      });
      return callback(200, { response: reporteeAdded });
    } else {
      return callback(422, { message: `Unprocessable` });
    }
  } catch (err) {
    console.log(err);
    return callback(500, { error: `Something went wrong!` });
  }
};

<<<<<<< HEAD
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
        console.log(err);
        return callback(500, { error: `Something went wrong!` });
    }

}

module.exports = {
    userAddReportee: async (body, user, callback) => {
        const manager_id = user.dataValues.id;
        const reportee_id = body.reportee_id;

        return addReportee(manager_id, reportee_id, callback);
    },
=======
module.exports = {
<<<<<<< HEAD
    // addReportee: async (manager_id, reportee_id, callback) => {
    //     
    // },
>>>>>>> 10fea4b (Create addReportee function)

    adminAddReportee: async (body, callback) => {
        const { manager_id, reportee_id } = body;

        return addReportee(manager_id, reportee_id, callback);

<<<<<<< HEAD
    },

    userDeleteReportee: async (body, user, callback) => {
        const manager_id = user.dataValues.id;
        const reportee_id = body.reportee_id;

        return deleteReportee(manager_id, reportee_id, callback);
    },

    adminDeleteReportee: async (body, callback) => {
        const { manager_id, reportee_id } = body;

        return deleteReportee(manager_id, reportee_id, callback);
=======
>>>>>>> 10fea4b (Create addReportee function)
    }
}
=======
    adminAddReportee: async (body, data,callback) => {
        console.log(data);
    const manager_id = body;
    const reportee_id = data;

    return addReportee(manager_id, reportee_id, callback);
  },
};
>>>>>>> 92e8ebe (registration-API)
