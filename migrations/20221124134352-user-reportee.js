"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("user_reportee", {
      manager_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      reportee_id: {
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
    await queryInterface.dropTable("user_reportee");
  },
};
