'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class designation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      designation.hasMany(models.designation_user_mapping, {
        foreignKey:"designation_id"
      })
    }
  }
  designation.init(
    {
      designation_title: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "designations",
      modelName: "designation",
      paranoid: true,
      timestamps: true,
    }
  );
  return designation;
};