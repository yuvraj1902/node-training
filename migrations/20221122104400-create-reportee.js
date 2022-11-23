'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('reportees', {
      id: {
        type:DataTypes.UUID,
        allowNull:false,
        defaultValue: DataTypes.literal('uuid_generate_v4()'),
        primaryKey:true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE
      }
    })
    await queryInterface.addConstraint('reportees',  {
      fields: ['reportee_id', 'manager_id'],
      type: 'unique',
      name: 'composite_key_name'
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('reportees');
  }, 
};