'use strict';
const { v4: uuidv4 } = require("uuid");

const {
  Model,Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'id'
      });
    }
  }
  RefreshToken.init({
    user_id: {
      allowNull: true,
      type: Sequelize.UUID,
      references: {
        model: 'user',
        key:'id'
      }
    },
    token: {
       type: Sequelize.UUID,
        allowNull: true,
        primaryKey: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()")
    },
    expiry_date: {
      type: Sequelize.BIGINT,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_token'
  });
  RefreshToken.createToken = async function (user) {
    let expiredAt = new Date();
    
    expiredAt.setSeconds(expiredAt.getSeconds() + process.env.jwtRefreshExpiration);

    console.log(expiredAt.getTime());
    // let _token = uuidv4();
    console.log("here",user.id);
    let refreshToken = await this.create({
      user_id: user.id,
      expiry_date: expiredAt.getTime(),
    });
    console.log("Not here");
    return refreshToken.token;
  };

  RefreshToken.verifyExpiration = (expiryDate) => {
    console.log(expiryDate);
    return expiryDate < new Date().getTime();
  };
  return RefreshToken;
};