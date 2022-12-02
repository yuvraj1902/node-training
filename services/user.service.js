const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const models = require("../models");
const { sequelize } = require("../models");
const mailer = require("../helper/sendmail");


const loginUser = async (payload) => {
  const { email, password } = payload;

  const user = await models.User.findOne({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw new Error("Credentials are invalid!");
  }

  const match = await bcrypt.compareSync(password, user.password);
  if (!match) {
    throw new Error("Wrong email or password");
  }

  // jwt token assignment
  const accessToken = jwt.sign({ userId: user.id }, process.env.secretKey, {
    expiresIn: process.env.jwtExpiration,
  });
  let refreshToken = await models.RefreshToken.createToken(user);

  let userRoles = await models.UserRoleMapping.findAll({
    where: {
      user_id: user.id,
    },
  });
  let authorities = [];
  for (let i = 0; i < userRoles.length; i++) {
    const role = await models.Role.findOne({
      where: {
        id: userRoles[i].role_id,
      },
    });
    authorities.push(role.role_title);
  }

  return {
    id: user.id,
    email: user.email,
    roles: authorities,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

module.exports = {
  // Login
  loginUser,
};
