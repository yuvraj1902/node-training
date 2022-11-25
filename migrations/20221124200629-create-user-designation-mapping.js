"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    return queryInterface.createTable("user_designation_mapping", {
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
      designation_id: {
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
    await queryInterface.dropTable("user_designation_mapping");
  },
};
