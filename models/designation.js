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
