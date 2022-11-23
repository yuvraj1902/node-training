'use strict';


module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.addColumn("reportees", "reportee_id", {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
        allowNull: false,
        autoIncrement: true
      }
    })
    await queryInterface.addColumn("reportees", "manager_id", {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
        allowNull: false,
        autoIncrement: true
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.removeColumn("reportees", "reportee_id")
    await queryInterface.removeColumn("reportees", "manager_id")
  }
};