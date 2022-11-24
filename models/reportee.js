'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reportee extends Model {

    static associate(models) {
      
    }
  }
  Reportee.init({
    reportee_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    manager_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    paranoid: true,
    tableName: 'reportees',
    modelName: 'Reportee',
  });
  return Reportee;
};