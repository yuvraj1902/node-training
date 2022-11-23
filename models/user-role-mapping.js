'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRoleMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Role }) {
      this.belongsTo(User, { foreignKey: user_id, targetKey: id })
      this.belongsTo(Role, { foreignKey: role_id, targetKey: id })
    }
  }
  UserRoleMapping.init({
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user_role_mapping',
    modelName: 'UserRoleMapping',
    paranoid: true,
    timestamps: true
  });
  return UserRoleMapping;
};