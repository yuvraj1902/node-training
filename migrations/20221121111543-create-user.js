'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('users', {
      id:{
          type:DataTypes.UUID,
          allowNull:false,
          defaultValue:DataTypes.UUIDV4,
          primaryKey:true
      },
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
      role : {
        type: DataTypes.ENUM(['CEO','lead','employee','intern']) ,
        allowNull: false,
      },
      is_delete : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: '0'
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, 
  );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};