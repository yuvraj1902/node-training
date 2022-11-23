'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reportee extends Model {
   
    static associate(models) {
      Reportee.belongsTo(models.User,{
        foreignKey:"reportee_id",
        targetKey:"id"
      })
      Reportee.belongsTo(models.User,{
       foreignKey:"manager_id",
        targetKey:"id"
      })
    }
  }
  Reportee.init({
    reportee_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    manager_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    paranoid:true,
    tableName:'reportees',
    modelName: 'Reportee',
  });
  return Reportee;
};