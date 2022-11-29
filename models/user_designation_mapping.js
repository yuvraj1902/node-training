"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserDesignationMapping extends Model {
    static associate(models) {}
  }
  UserDesignationMapping.init(
    {
      user_id: {
        type: DataTypes.UUID,
      },
      designation_id: {
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      tableName: "user_designation_mapping",
      modelName: "UserDesignationMapping",
      defaultScope: {
        attributes: {
          exclude: ["created_at", "updated_at", "deleted_at"],
        },
      },
    }
  );
  return UserDesignationMapping;
};
