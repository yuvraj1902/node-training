"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
<<<<<<< HEAD:migrations/20221121111543-create-user.js
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("user", {
      id: {
=======
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
        id: {
>>>>>>> 3b79d83 (refactor database  models, associations, migrations):migrations/20221203053331-create-user.js
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue:Sequelize.literal('uuid_generate_v4()')
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlphanumeric: true,
      },
      organization: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlphanumeric: true,
      },
      google_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        defaultValue: null,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
        isAlphanumeric: true,
      },
      source: {
<<<<<<< HEAD:migrations/20221121111543-create-user.js
        type: DataTypes.STRING,
        allowNull: false,
        isAlphanumeric: true,
      },
      is_firsttime: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
=======
        type: Sequelize.STRING,
        allowNull: true,
        isAlphanumeric: true,
      },
      is_firsttime: {
        type: Sequelize.BOOLEAN,
        allowNull: false
>>>>>>> 3b79d83 (refactor database  models, associations, migrations):migrations/20221203053331-create-user.js
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
<<<<<<< HEAD:migrations/20221121111543-create-user.js
        type: DataTypes.DATE,

        defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE,

        defaultValue: null,
=======
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
>>>>>>> 3b79d83 (refactor database  models, associations, migrations):migrations/20221203053331-create-user.js
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
