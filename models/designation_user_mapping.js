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
      // define association here
      DesignationUserMapping.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
      });
      DesignationUserMapping.belongsTo(models.Designation, {
        foreignKey: "designation_id",
        targetKey: "designation_code",
      });
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
      tableName: "DesignationUserMappings",
      modelName: "DesignationUserMapping",
      paranoid: true,
      timestamps: true,
    }
  );
  return DesignationUserMapping;
};
