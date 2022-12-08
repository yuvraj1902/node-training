module.exports = {
   async up(queryInterface) {
      return queryInterface.sequelize.query('ALTER TABLE user_reportee_mapping ADD CONSTRAINT userreporteekey UNIQUE (manager_id, reportee_id,deleted_at);');
   },

   async down(queryInterface) {
      return queryInterface.sequelize.query('ALTER TABLE user_reportee_mapping DROP CONSTRAINT userreporteekey;');
   }
};