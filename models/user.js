'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      
    }
  }
  User.init({
    first_name : {
      type: DataTypes.STRING,
      allowNull:false,
      isAlpha:true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull:false,
      isAlpha:true
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        isEmail:true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      isNumeric: true,
      unique: true
    },
    user_name:{
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      isAlphanumeric: true
    },
    token: {
      type: DataTypes.TEXT ,
      allowNull: true
    },
    token_expiration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_admin : {
      type: DataTypes.ENUM(['true','false']) ,
      allowNull: false,
      defaultValue: 'false'
    },
    is_delete : {
      type: DataTypes.ENUM(['true','false']) ,
      allowNull: false,
      defaultValue: 'false'
    },
  }, 
 
  {
    sequelize,
    tableName:'users',
    modelName: 'User',
  });
  return User;
};