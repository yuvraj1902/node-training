'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("roles",[
      {
        role_key:"ADM",
        role_code:"1001",
        role_title:"Admin"
      },
      {
        role_key:"USR",
        role_code:"1002",
        role_title:"User"
      }
    ]
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
