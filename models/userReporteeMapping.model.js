"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class UserReporteeMapping extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'manager_id',
        targetKey: 'id'
      });
      this.belongsTo(models.User, {
        foreignKey: 'reportee_id',
        targetKey: 'id'
      });
    }
  }
  UserReporteeMapping.init(
    {
      manager_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      reportee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "user_reportee_mapping",
      modelName: "UserReporteeMapping",
    }
  );
  return UserReporteeMapping;
};
