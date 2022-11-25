'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("user_role_mapping", {
      id: {
        allowNull: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.fn("uuid_generate_v4"),
      },

      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('user_role_mapping');
  }
};
