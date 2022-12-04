'use strict';
const {
  Model,Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRoleMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRoleMapping.belongsTo(models.User,{ foreignKey: 'user_id' });
      UserRoleMapping.belongsTo(models.Role,{ foreignKey: 'role_id' });
    }
  }
  UserRoleMapping.init({
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key:'id'
        }
      },
      role_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "role",
          key:'id'
        }
      }
  }, {
    sequelize,
    modelName: 'UserRoleMapping',
    tableName:"user_role_mapping"
  });
  return UserRoleMapping;
};