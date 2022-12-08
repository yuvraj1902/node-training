'use strict';
const {
  Model,Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Role.belongsToMany(models.User, {through : 'user_role_mapping'});
      models.Role.belongsToMany(models.User, {
        through: models.UserRoleMapping,
        foreignKey: 'role_id',
      });
    }
  }
  Role.init({
    // id: {
    //     allowNull: false,
    //     primaryKey: true,
    //     type: Sequelize.UUID,
    //     defaultValue:Sequelize.literal('uuid_generate_v4()')
    //   },
      role_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true,
      },
      role_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true,
      },
      role_title: {
         allowNull: false,
        type: Sequelize.STRING,
      },
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'role',
    paranoid: true,
    timestamps:true
  });
  return Role;
};