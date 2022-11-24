"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRoleMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Role }) {
      User.belongsToMany(Role, {
        through: UserRoleMapping,
      });
      Role.belongsToMany(User, {
        through: UserRoleMapping,
      });

    }
  }
  UserRoleMapping.init(
    {
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
