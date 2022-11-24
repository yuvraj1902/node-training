"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRoleMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserRoleMapping.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
      });
      UserRoleMapping.belongsTo(models.Role, {
        foreignKey: "role_code",
        targetKey: "role_code",
      });
    }
  }
  UserRoleMapping.init(
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role_code: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "user_role_mapping",
      modelName: "UserRoleMapping",
      paranoid: true,
      timestamps: true,
    }
  );
  return UserRoleMapping;
};
