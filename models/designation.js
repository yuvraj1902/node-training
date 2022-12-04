'use strict';
const {
  Model,Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Designation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       models.Designation.belongsToMany(models.User, {
        through: models.UserDesignationMapping,
        foreignKey: 'designation_id',
      });
    }
  }
  Designation.init({
   designation_title: {
        type: Sequelize.STRING,
      },
      designation_code: {
        type: Sequelize.INTEGER,
      },
  }, {
    sequelize,
    modelName: 'Designation',
    tableName: "designation",
    paranoid:true
  });
  return Designation;
};