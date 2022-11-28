"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserReportee extends Model {
    static associate(models) { }
  }
  UserReportee.init(
    {
      manager_id: {
        type: DataTypes.UUID,
      },
      reportee_id: {
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "user_reportee",
      modelName: "UserReportee",
    }
  );
  return UserReportee;
};
