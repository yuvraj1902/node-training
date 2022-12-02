"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      this.belongsToMany(models.User, { through: 'user_role_mapping' })
    }
  }
  Role.init({
    role_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    role_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    role_title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    tableName: 'role',
    modelName: 'Role',
    paranoid: true,
    timestamps: true
  });
  return Role;
};
