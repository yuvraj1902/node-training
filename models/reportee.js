'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reportee extends Model {
   
    static associate(models) {
      Reportee.belongsTo(models.User,{
        foreignKey:"reporteeId",
        targetKey:"id"
      })
      Reportee.belongsTo(models.User,{
       foreignKey:"reporterId",
        targetKey:"id"
      })
    }
  }
  Reportee.init({
    reporteeId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    reporterId: {
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    tableName:'reportees',
    modelName: 'Reportee',
  });
  return Reportee;
};