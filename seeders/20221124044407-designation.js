"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("designations", [
      {
        designation_code: "101",
        designation_title: "CEO",
      },
      {
        designation_code: "102",
        designation_title: "LEAD",
      },
      {
        designation_code: "103",
        designation_title: "EMPLOYEE",
      },
      {
        designation_code: "104",
        designation_title: "INTERN",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("designations", null, {});
  },
};
