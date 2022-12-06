'use strict';
const { v4: uuidv4 } = require("uuid");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
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
      unique: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    token: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    },
    expiry_date: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_token'
  });
  RefreshToken.createToken = async function (user) {
    let expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + process.env.jwtRefreshExpiration);

    let token = uuidv4();
    // let refreshToken = await this.create({
    //   token: _token,
    //   user_id: user.dataValues.id,
    //   expiry_date: expiredAt.getTime(),
    // });

    return token;
  };

  RefreshToken.verifyExpiration = (expiryDate) => {
    return expiryDate < new Date().getTime();
  };
  return RefreshToken;
};