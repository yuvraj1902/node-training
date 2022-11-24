"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Designation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Designation.hasMany(models.DesignationUserMapping, {
        foreignKey: "designation_id",
      });
    }
  }
  Designation.init(
    {
      designation_title: DataTypes.STRING,
      designation_code: {
        type: DataTypes.INTEGER,
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
