"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("DesignationUserMappings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.literal("uuid_generate_v4()"),
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
          allowNull: false,
          
        },
      },
      designation_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "designations",
          key: "designation_code",
          allowNull: false,
        },
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
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("DesignationUser_mappings");
  },
};
