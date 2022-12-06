module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query('ALTER TABLE refresh_token ADD CONSTRAINT refreshkey UNIQUE (user_id);');
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query('ALTER TABLE refresh_token DROP CONSTRAINT refreshkey;');
  }
};