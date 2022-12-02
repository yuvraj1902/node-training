"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Designation, {
        through: "user_designation_mapping",
      });
      this.belongsToMany(models.Role, { through: "user_role_mapping" });

      this.belongsToMany(models.User, {
        through: "user_reportee",
        as: "manager_id",
      });
      this.belongsToMany(models.User, {
        through: "user_reportee",
        as: "reportee_id",
      });
      this.hasOne(models.RefreshToken, {
        foreignKey: "user_id",
        targetKey: "id",
      });
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
        defaultValue: null,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
        isAlphanumeric: true,
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
        isAlphanumeric: true,
      },
      is_firsttime: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },

    {
      sequelize,
      paranoid: true,
      tableName: "user",
      modelName: "User",
      attributes: {
        exclude: [
          "password",
          "token",
          "token_expiration",
          "created_at",
          "updated_at",
          "deleted_at",
        ],
      },
    }
  );
  return User;
};
