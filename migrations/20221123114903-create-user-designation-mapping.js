"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('user_designation_mapping', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.literal('uuid_generate_v4()'),
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'User',
          key: 'id',
          allowNull: false,
        },
      },
      designation_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Designations',
          key: 'designation_code',
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
        defaultValue: null,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("user_designation_mapping");
  },
};
