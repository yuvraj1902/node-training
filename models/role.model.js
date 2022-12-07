"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Role extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.UserRoleMapping,
        foreignKey: 'role_id',
      })
    }
  }
  Role.init({
    role_key: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    role_code: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    },
    role_title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    tableName: 'role',
    modelName: 'Role',
    paranoid: true,
  
  });
  return Role;
};
