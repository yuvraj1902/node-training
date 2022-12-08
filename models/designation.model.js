"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Designation extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.UserDesignationMapping,
        foreignKey: 'designation_id',
      });
    }
  }
  Designation.init(
    {
      designation_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      designation_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "designation",
      modelName: "Designation",
      paranoid: true
    }
  );
  return Designation;
};
