const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const models = require('../models');
const { sequelize } = require('../models');
const mailer = require('../helper/sendmail');
const { adminAddReportee } = require('./userReportee.service');
const redisClient = require('../utility/redis');
const UniqueStringGenerator = require('unique-string-generator');

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
    attributes: { exclude: ["created_at", "updated_at", "deleted_at"] }
  });
  if (!user) {
    throw new Error('User Not Found!');
  }

  const match = await bcrypt.compareSync(password, user.dataValues.password);
  if (!match) {
    throw new Error('Wrong email or password');
  }

  const accessToken = jwt.sign({ userId: user.id }, process.env.secretKey, {
    expiresIn: process.env.jwtExpiration
  });
  const refreshToken = jwt.sign({ userId: user.id }, process.env.secretKey, {
    expiresIn: process.env.jwtRefreshExpiration
  });

  delete user.dataValues.password;
  await redisClient.set(user.id, JSON.stringify(user));
  await redisClient.set(refreshToken, JSON.stringify("true"));

  return {
    id: user.id,
    email: user.email,
    accessToken: accessToken,
    refreshToken: refreshToken,
  }
}

const refreshToken = async (requestToken) => {

  let refreshToken = await redisClient.get(requestToken);

  if (!refreshToken) {
    throw new Error('Login required!');
  }

  const decoded_jwt = jwt.verify(requestToken, process.env.secretKey);
  
  let newAccessToken = jwt.sign({ userId: decoded_jwt.userId }, process.env.secretKey, {
    expiresIn: process.env.jwtExpiration
  });

  return {
    accessToken: newAccessToken,
    refreshToken: requestToken,
  }
}

const getAllUsers = async () => {
  const users = await models.User.findAll({
    attributes: { exclude: ["password"] },
  });
  if (!users) {
    throw new Error('Not Found');
  }
//  await redisClient.set("allUsersData", users);
  let getCacheData = await redisClient.get("allUsersData");
  let  userData = JSON.parse(getCacheData)
  if (getCacheData) {
    return userData;
  }
  else {
    await redisClient.set("allUsersData", JSON.stringify(users));
     return users
  } 
}




const logoutUser = async (requestToken) => {
  await redisClient.del("refresh_token");
  await redisClient.del("user");
  // let refreshToken = await models.RefreshToken.findOne({ where: { token: requestToken } });
  // if (!refreshToken) return;
  // models.RefreshToken.destroy({ where: { token: refreshToken.token } });
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
    const is_data = await redisClient.get(payload.token);
    if (!is_data) {
      throw new Error("reset link expired");
    }
    const userExist = await models.User.findOne({ where: { id:is_data } });
    if (!userExist) {
      throw new Error('User Not Found');
    }
    await redisClient.del(payload.token);
    return resetPassword(payload.newPassword,userExist.id, userExist.email);
  }
}


const userDetail = async (payload) => {
  let key_name = payload.userId;
  const is_data = await redisClient.get(key_name);

  if (is_data) {
    return JSON.parse(is_data);
  }
  else {
    const userData = await models.User.findOne({
      where: {
        id: payload.userId
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

    if (!userData) {
      throw new Error("User Not Found");
    }
    await redisClient.set(key_name, JSON.stringify(userData));
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

  
     
  let randomToken = UniqueStringGenerator.UniqueString();
  let userId = user.dataValues.id;

  
  let baseUrl = process.env.BASE_URL;
  let resetPassawordLink = `${baseUrl}/api/user/reset-password/${randomToken}`;

  await redisClient.set(randomToken, userId);

  let recipient = email;
  let subject = "Reset Password Link";
  let body = `Password Reset Link:- ${resetPassawordLink}`;

  await mailer.sendMail(body, subject, recipient);
  return "send reset password link successfully";

}

const deactivateUser = async (payload) => {

  let { user_id } = payload;
  const user = await models.User.findOne({
    where: {
      id: user_id
    },
    include: [{
      model: models.Role,
      attributes: ["role_code"]
    }],

  });


  if (!user) {
    throw new Error("User Not Found")
  }

   if (user.Roles[0].role_code == 1001) {
     throw new Error("Access denied")
  }

  let destroyUser = await models.User.destroy({
    where: {
      id: user_id
    }
  });
  return "User deactivate";
 
 

}

const enableUser = async (payload) => {
  let { user_id } = payload;
  let restoreUser = await models.User.restore({
    where: {
      id: user_id
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
  payload.password = await hash(payload.password, 10);
  const trans = await sequelize.transaction();
  try {
    const existingUser = await models.User.findOne({
      where: { email: payload.email },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const user = await models.User.create(payload, { transaction: trans });
    delete user.dataValues.password;
    delete user.dataValues.created_at;
    delete user.dataValues.updated_at;
    delete user.dataValues.deleted_at;

    if (!user) {
      throw new Error("Something went wrong");
    }
    const userId = user.dataValues.id;
    if (payload.designation_code) {
      const designation = await models.Designation.findOne(
        {
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
        await models.UserDesignationMapping.create(
          {
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
      const role = await models.Role.findOne(
        {
          where: {
            role_key: payload.role_key,
          },
        },
        { transaction: trans }
      );

      if (!role) {
        throw new Error("Invalid Role");
      }
      const user_role_mapping = await models.UserRoleMapping.create(
        {
          user_id: userId,
          role_id: role.id,
        },
        { transaction: trans }
      );

      if (!user_role_mapping) {
        throw new Error("Something went wrong");
      }
    }
    if (payload.reportee_id) {
      await trans.commit();
      return {
        data: adminAddReportee({
          manager_id: userId,
          reportee_id: payload.reportee_id,
        }),
        error: null,
      };
    } else {
      await trans.commit();
      return { data: user, error: null };
    }
  } catch (error) {
    await trans.rollback();
    return { data: null, error: error };
  }
};

const registration = async (payload) => {
  payload.is_firsttime = false;
  payload.role_key = "USR";
  payload.password = await hash(payload.password, 10);
  const existingUser = await models.User.findOne({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const user = await models.User.create(payload);
  const userId = user.dataValues.id;
  const role = await models.Role.findOne({
    where: {
      role_key: payload.role_key,
    },
  });
  await models.UserRoleMapping.create({
    user_id: userId,
    role_id: role.id,
  });

  delete user.dataValues.password;
  delete user.dataValues.created_at;
  delete user.dataValues.updated_at;
  delete user.dataValues.deleted_at;
  return user;
};


module.exports = {
  loginUser,
  getAllUsers,
  refreshToken,
  logoutUser,
  resetUserPassword,
  userDetail,
  forgetPassword,
  deactivateUser,
  enableUser,
  createUser,
  registration
};




