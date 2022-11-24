"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
<<<<<<< HEAD
      this.belongsToMany(models.Designation, {
        through: "user_designation_mapping",
      });
=======
>>>>>>> fcc3e71 (Create user_role_mapping and user_reportee associations)
      this.belongsToMany(models.Role, { through: 'user_role_mapping' });

      this.belongsToMany(models.User, { through: 'user_reportee', as: 'manager_id' });
      this.belongsToMany(models.User, { through: 'user_reportee', as: 'reportee_id' });
    }
  }

  User.init(
    {
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
    },

    {
      sequelize,
      paranoid: true,
      tableName: "users",
      modelName: "User",
    }
  );
  return User;
};
