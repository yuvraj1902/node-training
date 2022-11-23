'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("designations", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.literal("uuid_generate_v4()"),
        primaryKey: true,
      },
      designation_titile: {
        type: DataTypes.STRING,
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
        defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
        allowNull: true,
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('designations');
  }
};