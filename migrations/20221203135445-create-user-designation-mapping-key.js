module.exports = {
   async up(queryInterface) {
    return queryInterface.sequelize.query('ALTER TABLE user_designation_mapping ADD CONSTRAINT userdesignationkey UNIQUE (user_id, designation_id);');
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query('ALTER TABLE user_designation_mapping DROP CONSTRAINT userdesignationkey;');
  }
};