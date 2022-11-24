"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserDesignationMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Designation }) {
      User.belongsToMany(Designation, {
        through: UserDesignationMapping,
      });
      Designation.belongsToMany(User, {
        through: UserDesignationMapping,
      });
    }
  }
  UserDesignationMapping.init(
    {
    },
    {
      sequelize,
      tableName: "user_designation_mapping",
      modelName: "UserDesignationMapping",
      paranoid: true,
      timestamps: true,
    }
  );
  return UserDesignationMapping;
};
