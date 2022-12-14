"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Designation, {
        through: models.UserDesignationMapping,
        foreignKey: 'user_id',
      });

      this.belongsToMany(models.Role, {
        through: models.UserRoleMapping,
        foreignKey: 'user_id',
      });

      this.belongsToMany(models.User, {
        through: models.UserReporteeMapping,
        as: 'manager_of',
        foreignKey: "manager_id",
      });

      this.belongsToMany(models.User, {
        through: models.UserReporteeMapping,
        as: 'reportee_of',
        foreignKey: "reportee_id",
      });
    }
  }

  User.init(
    {
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
        isAlphanumeric: true,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
        isAlphanumeric: true,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlphanumeric: true,
      },
      is_firsttime: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
    },

    {
      sequelize,
      paranoid: true,
      tableName: "user",
      modelName: "User",
    }
  );
  return User;
};
