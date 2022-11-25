"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Designation extends Model {
   
    static associate(models) {
      this.hasMany(models.UserDesignationMapping, {
        foreignKey: 'id'
      })
    }
  }
  Designation.init(
    {
      designation_title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      designation_code: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      sequelize,
      tableName: "designations",
      modelName: "Designation",
      paranoid: true,
      timestamps: true,
    }
  );
  return Designation;
};
