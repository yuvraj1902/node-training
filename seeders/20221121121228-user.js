'use strict';
const {hash}=require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users",[
      {
        first_name:"Dhruvil",
        last_name:"Dave",
        email:"dhruvil@gkmit.co",
        phone:"897654321",
        user_name:"dhruvil",
        password:await hash("1234",10),
        is_admin:'true'
      }
    ]
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
