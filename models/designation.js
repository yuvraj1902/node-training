"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Designation extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: "user_designation_mapping",
      });
    }
  }
  Designation.init(
    {
      designation_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designation_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "designations",
      modelName: "Designation",
      paranoid: true,
      timestamps: true,
      defaultScope: {
        attributes: {
          exclude: ["created_at", "updated_at", "deleted_at"],
        },
      },
    }
  );
  return Designation;
};
