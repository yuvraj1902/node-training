'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class UserReporteeMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserReporteeMapping.belongsTo(models.User, {foreignKey:'manager_id',targetKey:'id'});
      UserReporteeMapping.belongsTo(models.User, {foreignKey:'reportee_id',targetKey:'id'});
    }
  }
  UserReporteeMapping.init({
      manager_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user",
          key:"id",
        }
      },
      reportee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user",
          key:"id",
        }
      },
    },
   {
    sequelize,
     modelName: 'UserReporteeMapping',
     tableName:"user_reportee_mapping"
  });
  return UserReporteeMapping;
};