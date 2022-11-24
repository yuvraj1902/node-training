'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserReportee extends Model {

    static associate({ User }) {
      User.belongsToMany(User, {
        through: UserReportee,
        as: 'reportee_id'
      });
      User.belongsToMany(User, {
        through: UserReportee,
        as: 'manager_id'
      });
    }
  }
  UserReportee.init({

  }, {
    sequelize,
    paranoid: true,
    tableName: 'user_reportee',
    modelName: 'UserReportee',
  });
  return UserReportee;
};