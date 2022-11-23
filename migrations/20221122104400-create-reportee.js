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
        type: DataTypes.DATE,
        defaultValue:DataTypes.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue:DataTypes.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null
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