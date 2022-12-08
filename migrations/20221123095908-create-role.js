'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("role", {
      id: {
        type: Sequelize.UUID,
        allowNull: true,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      role_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      role_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      role_title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('role');
  }
};
