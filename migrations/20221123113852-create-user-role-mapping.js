'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('UserRoleMappings', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false
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
    await queryInterface.dropTable('UserRoleMappings');
  }
};