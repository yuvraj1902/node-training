'use strict';

/** @type {import(‘sequelize-cli’).Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
   await queryInterface.addColumn("reportees","reporteeId",{
      type:DataTypes.UUID,
      references:{
        model:"users",
        key:"id",
        allowNull:false,
        autoIncrement:true
      }
    })
    await queryInterface.addColumn("reportees","reporterId",{
      type:DataTypes.UUID,
      references:{
        model:"users",
        key:"id",
        allowNull:false,
        autoIncrement:true
      }
    })
  },
  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn("reportees","reporteeId")
    await queryInterface.removeColumn("reportees","reporterId")
  }
};
