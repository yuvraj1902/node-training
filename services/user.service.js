const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const models = require('../models');
const { sequelize } = require('../models');
const mailer = require('../helper/sendmail');
const { adminAddReportee } = require('./userReportee.service');
const { commonErrorHandler } = require('../helper/errorHandler');
const redis = require("../utility/redis");

const resetPassword = async (newPassword, id, userEmail) => {
  
  if (id) {
    await models.User.update({ password: await hash(newPassword,10) }, { where: { id: id } });
  }
  else {
    await models.User.update({ password: await hash(newPassword, 10) }, { where: { email: userEmail } });
  }
    const email_body = `Password reset successfull`;
    const email_subject = `Password reset`;
    await mailer.sendMail(email_body, email_subject, userEmail);
    return "Password reset successfully";
}



const loginUser = async (payload) => {
  const { email, password } = payload;

  const user = await models.User.findOne({
    where: {
      email: email
    }
  });
  if (!user) {
    throw new Error('Credentials are invalid!');
  }

  const match = await bcrypt.compareSync(password, user.password);
  if (!match) {
    throw new Error('Wrong email or password');
  }

  // jwt token assignment
  const accessToken = jwt.sign({ userId: user.id }, process.env.secretKey, {
    expiresIn: process.env.jwtExpiration
  });
  let refreshToken = await models.RefreshToken.createToken(user);

  return {
    id: user.id,
    email: user.email,
    accessToken: accessToken,
    refreshToken: refreshToken,
  }
}

const refreshToken = async (requestToken) => {
  if (!requestToken) throw new Error('Refresh Token is required!');

  let refreshToken = await models.RefreshToken.findOne({ where: { token: requestToken } });
  if (!refreshToken) {
    throw new Error('Refresh token is not in database!');
  }

  if (models.RefreshToken.verifyExpiration(refreshToken.expiry_date)) {
    models.RefreshToken.destroy({ where: { token: refreshToken.token } });
    throw new Error('Refresh token was expired. Please make a new signin request');
  }

  const userId = refreshToken.user_id;
  let newAccessToken = jwt.sign({ userId: userId }, process.env.secretKey, {
    expiresIn: process.env.jwtExpiration
  });

  return {
    accessToken: newAccessToken,
    refreshToken: refreshToken.token,
  }
}

const getAllUsers = async () => {
  const users = await models.User.findAll({
    attributes: { exclude: ["password"] },
  });
  if (!users) {
    throw new Error('Not Found');
  }
  return users;
}

const logoutUser = async (requestToken) => {
  let refreshToken = await models.RefreshToken.findOne({ where: { token: requestToken } });
  if (!refreshToken) return;
  models.RefreshToken.destroy({ where: { token: refreshToken.token } });

  return;

}

const resetUserPassword = async (payload) => {

  if (payload.userEmail) {
    const userExist = await models.User.findOne({ where: { email: payload.userEmail } });
    if (!userExist) {
      throw new Error('User Not Found');
    }
    console.log(payload);
    return resetPassword(payload.newPassword,null,payload.userEmail);
  }
  else if (payload.token) {
    if (!await get(payload.token)) {
      throw new Error("reset link expired");
    }
    const decode_token = jwt.verify(payload.token, process.env.secretKey);
    if (!decode_token) {
      throw new Error('Invalid reset link');
    }
    const userExist = await models.User.findOne({ where: { id: decode_token.userId } });
    if (!userExist) {
      throw new Error('User Not Found');
    }
    await redis.del(payload.token);
    return resetPassword(payload.newPassword,userExist.id, userExist.email);
  }
}

const userInfo = async (payload) => {
  let key_name = payload.userId;
  let is_data = await redis.get(key_name);

  if (is_data) {
    return JSON.parse(is_data);
  }
  else {
    const userInfo = await models.User.findOne({
    where: { id: payload.userId },
    include: [{
      model: models.Role,
      required: false,
      attributes: ["role_title"]
    }, {
      model: models.Designation,
      attributes: ["designation_title"]
    }],
    attributes: { exclude: ["password", "created_at", "updated_at", "deleted_at"] }
    });
    await redis.set(key_name, JSON.stringify(userInfo));
    return userInfo;
  }
}

const userDetail = async (payload) => {
  const user_id = payload.user_id;
  let key_name = user_id;
  const is_data = await redis.get(key_name);

  if (is_data) {
    return JSON.parse(is_data);
  }
  else {
    const userDesignationData = await models.User.findOne({
      where: {
        id: user_id
      },
      include: [{
        model: models.Designation,
        attributes: ["designation_title"]
      },
      {
        model: models.Role,
        attributes: ["role_title"]
      },
      {
        model: models.User,
        as: 'reportee_of',
        attributes: { exclude: ["password", "created_at", "updated_at", "deleted_at", "UserReporteeMapping"] }
      }],
      attributes: { exclude: ["password", "created_at", "updated_at", "deleted_at"] }
    });
    await redis.set(key_name, JSON.stringify(userDesignationData));
    return userDesignationData;
  }
}

const forgetPassword = async (payload) => {

  const { email } = payload;
  const user = await models.User.findOne({
    where: {
      email: email
    }
  })

  if (!user) {
    throw new Error('User Not Found!');
  }

  let tokenData = {
    userId: user.dataValues.id,
    time: Date.now()
  }
  let signUserToken = jwt.sign(tokenData, process.env.secretKey, {
    expiresIn: process.env.FPT_EXPIRES_IN
  });
  let baseUrl = process.env.BASE_URL;
  let resetPassawordLink = `${baseUrl}/api/user/reset-password/${signUserToken}`;

  await redis.set(signUserToken, resetPassawordLink);
  let recipient = email;
  let subject = "Reset Password Link";
  let body = `Password Reset Link:- ${resetPassawordLink}`;


  await mailer.sendMail(body, subject, recipient);
  return "send reset password link successfully";

}

const deactivateUser = async (payload) => {

  let { userId } = payload;
  const user = await models.User.findOne({
    where: {
      id: userId
    }
  });

  if (!user) {
    throw new Error("User Not Found")
  }

  let destroyUser = await models.User.destroy({
    where: {
      id: userId
    }
  });
  return "User Deactiveted"
}

const enableUser = async (payload) => {
  let { userId } = payload;
  let restoreUser = await models.User.restore({
    where: {
      id: userId
    }
  });
  if (restoreUser) {
    return "User activated"
  } else {
    throw new Error("User not found");
  }

}

const createUser = async (payload) => {
  payload.is_firsttime = true;
  payload.password = await hash(payload.password, 10)
  const trans = await sequelize.transaction();
  try {
    const existingUser = await models.User.findOne({
      where: { email: payload.email },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const user = await models.User.create(payload,
      { transaction: trans }
    );

    if (!user) {
      throw new Error("Something went wrong");
    }
    const userId = user.dataValues.id;
    if (payload.designation_code) {
      const designation = await models.Designation.findOne({
        where: {
          designation_code: payload.designation_code,
        },
      },
        { transaction: trans }
      );
      if (!designation) {

        throw new Error("Invalid Designation");
      }
      const designation_user_mapping_designationID =
        await models.UserDesignationMapping.create({
          designation_id: designation.id,
          user_id: userId,
        },
          { transaction: trans }
        );
      if (!designation_user_mapping_designationID) {

        throw new Error("Something went wrong");
      }
    }
    if (payload.role_key) {
      const role = await models.Role.findOne({
        where: {
          role_key: payload.role_key,
        },
      },
        { transaction: trans }
      );

      if (!role) {

        throw new Error("Invalid Role");
      }
      const user_role_mapping = await models.UserRoleMapping.create({
        user_id: userId,
        role_id: role.id
      },
        { transaction: trans }
      );

      if (!user_role_mapping) {

        throw new Error("Something went wrong");
      }
    }
    if (payload.reportee_id) {
      await trans.commit();
      return { data: adminAddReportee({ manager_id: userId, reportee_id: payload.reportee_id }),error:null};
    } else {
      await trans.commit();
    return { data: user,error:null};

    }
  } catch (error) {
    await trans.rollback();
    return { data: null,error:error};
  }
};

const registration = async (payload) => {
  payload.is_firsttime = false;
  payload.password = await hash(payload.password, 10);
  const existingUser = await models.User.findOne({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const user = await models.User.create(payload);
  return user;
}
module.exports = {
  loginUser,
  getAllUsers,
  refreshToken,
  logoutUser,
  resetUserPassword,
  userInfo,
  userDetail,
  forgetPassword,
  deactivateUser,
  enableUser,
  createUser,
  registration
};




