"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRoleMapping extends Model {
    static associate(models) {}
  }
  UserRoleMapping.init(
    {
      user_id: {
        type: DataTypes.UUID,
      },
      role_id: {
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      tableName: "user_role_mapping",
      modelName: "UserRoleMapping",
      defaultScope: {
        attributes: {
          exclude: ["created_at", "updated_at", "deleted_at"],
        },
      },
    }
  );
  return UserRoleMapping;
};
