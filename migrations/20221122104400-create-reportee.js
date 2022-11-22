'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('reportees', {
      id: {
        type:DataTypes.UUID,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
    await queryInterface.addConstraint('reportees',  {
      fields: ['reporteeId', 'reporterId'],
      type: 'unique',
      name: 'composite_key_name'
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('reportees');
  }, 
};