'use strict';
const {hash}=require('bcrypt')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users",[
      {
        first_name:"Jitesh",
        last_name:"Sisodiya",
        email:"jitesh@gkmit.co",
        phone:"897654321",
        user_name:"jitesh",
        password:await hash("1234",10),
        role:"CEO"
      }
    ]
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
