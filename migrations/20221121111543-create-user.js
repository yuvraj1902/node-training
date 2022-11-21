'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.fn("uuid_generate_v4"),
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        isAlpha: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        isAlpha: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        isAlphanumeric: true,
      },
      organization: {
        type: DataTypes.STRING,
        allowNull: false,
        isAlphanumeric: true,
      },
      google_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        isAlphanumeric: true,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
        isAlphanumeric: true,
      },
      source: {
        type: DataTypes.STRING,
        allowNull: true,
        isAlphanumeric: true,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      token_expiration: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
<<<<<<< HEAD
        defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
=======
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
>>>>>>> c733801 (create seeder for admin)
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
<<<<<<< HEAD
        defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
      },
    });
=======
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      }
    }, 
  );
>>>>>>> c733801 (create seeder for admin)
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};