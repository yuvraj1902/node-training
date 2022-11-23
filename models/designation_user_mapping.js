"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class designation_user_mapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      designation_user_mapping.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
      });
      designation_user_mapping.belongsTo(models.designation, {
        foreignKey: "designation_id",
        targetKey: "id",
      });
    }
  }
  designation_user_mapping.init(
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      designation_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "designation_user_mappings",
      modelName: "designation_user_mapping",
      paranoid: true,
      timestamps: true,
    }
  );
  return designation_user_mapping;
};
