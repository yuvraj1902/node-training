'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserReportee extends Model {

    // static associate(models) {
    //   Reportee.belongsTo(models.User, {
    //     foreignKey: "reportee_id",
    //     targetKey: "id"
    //   })
    //   Reportee.belongsTo(models.User, {
    //     foreignKey: "manager_id",
    //     targetKey: "id"
    //   })
    // }
  }
  UserReportee.init({
    reportee_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    manager_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    paranoid: true,
    tableName: 'user_reportee',
    modelName: 'UserReportee',
  });
  return UserReportee;
};