'use strict';
const { v4: uuidv4 } = require("uuid");

const {
  Model
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
      primaryKey: true,
      type: DataTypes.UUID,
    },
    token: {
      type: DataTypes.STRING,
    },
    expiry_date: {
      type: DataTypes.BIGINT,
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
    let _token = uuidv4();
    console.log("here");
    let refreshToken = await this.create({
      token: _token,
      user_id: user.dataValues.id,
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