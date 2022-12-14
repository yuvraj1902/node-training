

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("role", [
      {
        role_key: "ADM",
        role_code: "1001",
        role_title: "Admin",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_key: "USR",
        role_code: "1002",
        role_title: "User",
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role', null, {});
  }
};