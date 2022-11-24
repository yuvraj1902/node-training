'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('user_reportee', {
      id: {
        type:DataTypes.UUID,
        allowNull:false,
        defaultValue: DataTypes.literal('uuid_generate_v4()'),
        primaryKey:true
      },
      reportee_id: {
        type:DataTypes.UUID,
        allowNull:false,
      },
      manager_id: {
        type:DataTypes.UUID,
        allowNull:false,
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
    await queryInterface.addConstraint('user_reportee',  {
      fields: ['reportee_id', 'manager_id'],
      type: 'unique',
      name: 'composite_key_name'
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('user_reportee');
  }, 
};