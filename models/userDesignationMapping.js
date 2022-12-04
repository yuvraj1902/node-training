'use strict';
const {
  Model,Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDesignationMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDesignationMapping.belongsTo(models.User,{ foreignKey: 'user_id' });
      UserDesignationMapping.belongsTo(models.Designation,{ foreignKey: 'designation_id' });
    }
  }
  UserDesignationMapping.init({
    id: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      user_id: {
        allowNull:false,
        type: Sequelize.UUID,
        references:{
          model: "user",
          key:'id'
        }
      },
      designation_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "designation",
          key:'id'
        }
      },

  }, {
    sequelize,
    modelName: 'UserDesignationMapping',
    tableName: "user_designation_mapping",
    paranoid:true,
  });
  return UserDesignationMapping;
};