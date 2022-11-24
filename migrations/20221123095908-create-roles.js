'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('roles', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true,
      },
      role_key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      role_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      role_title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      deleted_at: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('roles');
  }
};