"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DesignationUserMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  DesignationUserMapping.init(
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      designation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "designation_user_mappings",
      modelName: "DesignationUserMapping",
      paranoid: true,
      timestamps: true,
    }
  );
  return DesignationUserMapping;
};
