"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class UserDesignationMapping extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
      this.belongsTo(models.Designation, {
        foreignKey: 'designation_id'
      });
    }
  }
  UserDesignationMapping.init({
    user_id: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: "user",
        key: 'id'
      }
    },
    designation_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "designation",
        key: 'id'
      }
    },
    },
    {
      sequelize,
      tableName: "user_designation_mapping",
      modelName: "UserDesignationMapping",
      paranoid: true,
    }
  );
  return UserDesignationMapping;
};
