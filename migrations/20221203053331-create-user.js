'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
        id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue:Sequelize.literal('uuid_generate_v4()')
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlphanumeric: true,
      },
      organization: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlphanumeric: true,
      },
      google_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        isAlphanumeric: true,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
        isAlphanumeric: true,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: true,
        isAlphanumeric: true,
      },
      is_firsttime: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  }
};