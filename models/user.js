'use strict';
const {
  Model,Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.belongsToMany(models.Role, { through: 'user_role_mapping' });
      models.User.belongsToMany(models.Role, {
        through: models.UserRoleMapping,
        foreignKey: 'user_id',
      });
      models.User.belongsToMany(models.Designation, {
        through: models.UserDesignationMapping,
        foreignKey: 'user_id',
      });
      models.User.belongsToMany(models.User, {
        through: models.UserReporteeMapping,
        as:'manager_of',
        foreignKey: "manager_id",
      })

      models.User.belongsToMany(models.User, {
        through: models.UserReporteeMapping,
        as:'reportee_of',
        foreignKey: "reportee_id",
      })

      models.User.hasOne(models.RefreshToken, {
        foreignKey: "user_id",
      })
    }
  }
  User.init({
   first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
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
        allowNull: true,
        isAlphanumeric: true,
      },
      is_firsttime: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    paranoid:true,
  });
  return User;
};