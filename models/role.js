'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Roles.hasMany(models.UserRoleMapping, { foreignKey: "user_id" })
    }
  }
  Roles.init({
    role_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    role_code: {
      type: DataTypes.STRING,
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
    tableName: 'roles',
    modelName: 'Roles',
    paranoid: true,
    timestamps: true
  });
  return Roles;
};