module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query('ALTER TABLE user_role_mapping ADD CONSTRAINT userrolekey UNIQUE (user_id, role_id,deleted_at);');
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query('ALTER TABLE user_role_mapping DROP CONSTRAINT userrolekey;');
  }
};