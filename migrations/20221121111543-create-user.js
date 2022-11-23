'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.literal('uuid_generate_v4()')
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        isAlpha: true
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        isAlpha: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        isNumeric: true,
        unique: true
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        isAlphanumeric: true
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      token_expiration: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      role: {
        type: DataTypes.ENUM(['CEO', 'LEAD', 'EMPLOYEE', 'INTERN']),
        allowNull: false,
      },
      is_delete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: '0'
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      }
    },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};