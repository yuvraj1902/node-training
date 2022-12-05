'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_token', {
      user_id: {
        allowNull: true,
        type: Sequelize.UUID,
        unique: true,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      token: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      expiry_date: {
        type: Sequelize.BIGINT,
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
    await queryInterface.dropTable('refresh_token');
  }
};