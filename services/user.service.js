const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const models = require('../models');
const { sequelize } = require('../models');
const mailer = require('../helper/sendmail');
const { adminAddReportee } = require('./userReportee.service');




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


module.exports = {
  loginUser,
  getAllUsers,
  refreshToken,
  logoutUser,
  // User creation API
  createUser: async (data, callback) => {
    const trans = await sequelize.transaction();
    try {
      const existingUser = await models.User.findOne({
        where: { email: data.email },
      });
      //  checking existing User
      if (existingUser) {
        return callback(409, { message: `User already exists` },);
      }
      const value = {
        first_name,
        last_name,
        email,
        organization,
        google_id,
        source,
      } = data;
      // user creation

      const user = await models.User.create(
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: await hash(data.password, 10),
          organization: data.organization,
          google_id: data.google_id,
          source: data.source,
          is_firsttime: true
        },
        { transaction: trans }
      );

      if (!user) {
        await trans.rollback();
        return callback(500, { message: `Something went wrong` });
      }
      // finding userId
      const userId = user.dataValues.id;

      // checking is designation_title from req.body
      if (data.designation_title) {
        const designation = await models.Designation.findOne(
          {
            where: {
              designation_title: data.designation_title,
            },
          },
          { transaction: trans }
        );
        if (!designation) {
          await trans.rollback();
          return callback(400, { message: `Invalid Designation` });
        }
        // entry in user-designation-mapping
        const designation_user_mapping_designationID =
          await models.UserDesignationMapping.create(
            {
              designation_id: designation.id,
              user_id: userId,
            },
            { transaction: trans }
          );
        if (!designation_user_mapping_designationID) {
          await trans.rollback();
          return callback(500, { message: `Something went wrong` })
        }

      }
      // checking is role_title from req.body
      if (data.role_title) {
        const role = await models.Role.findOne(
          {
            where: {
              role_title: data.role_title,
            },
          },
          { transaction: trans }
        );


        if (!role) {
          await trans.rollback();
          return callback(400, { message: `Invalid Role` });

        }
        // entry in user-role-mapping
        const user_role_mapping = await models.UserRoleMapping.create(
          {
            role_id: role.id,
            user_id: userId,
          },
          { transaction: trans }
        );

        if (!user_role_mapping) {
          await trans.rollback();
          return callback(500, { message: `Something went wrong` });
        }
      }
      // transaction commit successfully
      await trans.commit();
      if (data.reportee_id) {
        return adminAddReportee({ manager_id: userId, reportee_id: data.reportee_id }, callback);
      } else {
        return callback(201, { data: value });
      }
    } catch (error) {
      // rollback transaction if any error
      await trans.rollback();
      return callback(500, { message: `Something went wrong!` });
    }
  },

  userInfo: async (userEmail, callback) => {
    try {
      const userDetails = await models.User.findOne({
        where: { email: userEmail },
      });

      const userManagerDetails = await models.UserReportee.findAll({
        where: { reportee_id: userDetails.dataValues.id },
      });

      const mangerDetailsArray = [];
      for (let i = 0; i < userManagerDetails.length; ++i) {
        const userDetails = await models.User.findOne({
          where: { id: userManagerDetails[i].dataValues.manager_id },
        });

        const mangerDetails = {
          firstName: userDetails.dataValues.first_name,
          lastName: userDetails.dataValues.last_name,
          email: userDetails.dataValues.email,
        };

        mangerDetailsArray.push(mangerDetails);
      }

      const userInfo = {
        firstName: userDetails.dataValues.first_name,
        lastName: userDetails.dataValues.last_name,
        email: userDetails.dataValues.email,
        organization: userDetails.dataValues.organization,
        google_id: userDetails.dataValues.organization,
        image_url: userDetails.dataValues.image_url,
        source: userDetails.dataValues.source,
        managers: mangerDetailsArray,
      };

      return callback(200, { response: userInfo });
    } catch (err) {
      return callback(500, `Something went wrong!`);
    }
  },

  registration: async (data, callback) => {
    try {
      const existingUser = await models.User.findOne({
        where: { email: data.email },
      });
      //  checking existing User
      if (existingUser) {
        return callback(409, { message: `User already exists` });
      }

      const value = ({
        first_name,
        last_name,
        email,
        organization,
        google_id,
        source,
      } = data);
      const user = await models.User.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: await hash(data.password, 10),
        organization: data.organization,
        google_id: data.google_id,
        source: data.source,
        is_firsttime: false
      });
      return callback(201, { data: value });
    } catch (error) {
      return callback(500, { message: `Something went wrong!` });
    }
  },
  forgetPassword: async (data, callback) => {

    let expirationTime = (Date.now() + (60 * 1000 * 20));
    let email = data.email;

    try {
      const existingUser = await models.User.findOne({ where: { email: email } });
      if (!existingUser) { return callback(404, { message: "User not found " }); }

      let tokenData = {
        email: email,
        expirationtime: Date.now()
      }

      let userToken = jwt.sign(JSON.stringify(tokenData), process.env.secretKey);
      let token = `http://localhost:3004/resetUserPassword?token=${userToken}`;


      const user = await models.User.update(
        {
          token_expiration: expirationTime,
          token: userToken
        },
        { where: { email: email } }
      );

      let recipient = email;
      let subject = "Reset Password Link"
      let body = `Password reset link- ${token}`;

      await mailer.sendMail(body, subject, recipient)
      return callback(200, { message: "password reset link sent" });
    } catch (err) {
      return callback(500, { error: "Something went wrong!" });
    }
  },


  resetUserPassword: async (query, data, callback) => {
    try {
      const reset_Token = query.token;
      const password = data.password;

      const currentTime = Date.now();

      const isUserExist = await models.User.findOne({
        where: {
          token: reset_Token,
          token_expiration: { [Op.gt]: currentTime },
        },
      });

      if (!isUserExist) {
        return callback(400, { error: "Invalid reset token" });
      }

      const userEmail = isUserExist.dataValues.email;

      await models.User.update(
        {
          password: await hash(password, 10),
          token_expiration: Date.now(),
        },
        {
          where: {
            email: userEmail,
          },
        }
      );

      const emailBody = `Your password has been reset successfully`;
      const emailSubject = `Password reset`;

      await mailer.sendMail(emailBody, emailSubject, userEmail);
      return callback(200, { message: "Password reset success" });
    } catch (err) {
      return callback(500, { error: `something went wrong` });
    }
  },

  deactivateUser: async (data, callback) => {
    try {
      let user_id = data.user_id;
      const existingUser = await models.User.findOne({ where: { id: user_id } });
      if (!existingUser) return callback(404, { message: `User not found` })
      const user = await models.User.destroy({
        where: {
          id: user_id
        }
      })
      return callback(202, { message: `User deactivate successfully` });
    } catch (error) {
      return callback(500, { message: `Something went wrong!` });
    }
  },
  enableUser: async (data, callback) => {
    try {
      let user_id = data.user_id;
      const user = await models.User.restore({
        where: {
          id: user_id
        }
      })
      if (!user) return callback(404, { message: `User not found` })
      return callback(202, { message: `User activated again` });
    } catch (error) {
      return callback(500, { message: `Something went wrong!` });
    }
  },

  userDetail: async (data, callback) => {
    try {
      let user_id = data.user_id;
      const user = await models.User.findOne({
        where: {
          id: user_id
        },
        include: models.Designation
      });

      const user2 = await models.User.findOne({
        where: {
          id: user_id
        },
        include: models.Role
      })
      if (!user) return callback(400, { message: `User not found` });
      const reportee = await models.UserReportee.findAll({
        where: {
          reportee_id: user_id
        },
      })
      let manager;
      let managers = [];
      if (reportee[0]) {
        for (let i = 0; i < reportee.length; i++) {
          manager = await models.User.findOne({
            where: {
              id: reportee[i].manager_id
            },
          })
          let singleManager = {
            manager_first_name: manager.first_name,
            manager_last_name: manager.last_name,
            manager_email: manager.email
          }
          managers.push(singleManager);
        }
      }
      let designation_title = {};
      let role_title = {};
      if (!user.Designations && !user.Roles) {
        designation_title = { destignation_title: user.Designations[0].dataValues.designation_title };
        role_title = { role_title: user2.Roles[0].dataValues.role_title };
      }
      let obj = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        google_id: user.google_id,
        organization: user.organization,
        source: user.source,
        designation_title: designation_title,
        role_title: role_title,
        manager_details: managers,
        created_at: user.created_at,
        updated_at: user.updated_at,
        deleted_at: user.deleted_at
      }
      return callback(202, {
        data: obj
      });
    } catch (error) {
      return callback(500, { message: `Something went wrong!` });
    }
  },

  userInfo: async (userEmail, callback) => {
    try {
      const userDetails = await models.User.findOne(
        { where: { email: userEmail } });

      const userManagerDetails = await models.UserReportee.findAll({ where: { reportee_id: userDetails.dataValues.id } });

      const mangerDetailsArray = [];
      for (let i = 0; i < userManagerDetails.length; ++i) {
        const userDetails = await models.User.findOne(
          { where: { id: userManagerDetails[i].dataValues.manager_id } });

        const mangerDetails = {
          firstName: userDetails.dataValues.first_name,
          lastName: userDetails.dataValues.last_name,
          email: userDetails.dataValues.email
        }

        mangerDetailsArray.push(mangerDetails);
      }


      const userInfo = {
        firstName: userDetails.dataValues.first_name,
        lastName: userDetails.dataValues.last_name,
        email: userDetails.dataValues.email,
        organization: userDetails.dataValues.organization,
        google_id: userDetails.dataValues.organization,
        image_url: userDetails.dataValues.image_url,
        source: userDetails.dataValues.source,
        managers: mangerDetailsArray
      }


      return callback(200, { message: userInfo });
    } catch (err) {
      return callback(500, `Something went wrong!`);
    }
  },
  forgetPassword: async (data, callback) => {

    let expirationTime = (Date.now() + (60 * 1000 * 20));
    let email = data.email;

    try {
      const existingUser = await models.User.findOne({ where: { email: email } });
      if (!existingUser) { return callback(404, { message: `User not found` }); }

      let tokenData = {
        email: email,
        expirationtime: Date.now()
      }

      let userToken = jwt.sign(JSON.stringify(tokenData), process.env.secretKey);
      let token = `http://localhost:3004/resetUserPassword?token=${userToken}`;


      await models.User.update(
        {
          token_expiration: expirationTime,
          token: userToken
        },
        { where: { email: email } }
      );

      let recipient = email;
      let subject = "Reset Password Link"
      let body = `Password reset link- ${token}`;

      await mailer.sendMail(body, subject, recipient)
      return callback(200, { message: `password reset link sent` });

    }
    catch (err) {
      return callback(500, { message: `Something went wrong!` });
    }
  },
  resetUserPassword: async (query, data, callback) => {
    try {
      const reset_Token = query.token;
      const password = data.password;

      const currentTime = Date.now();
      const isUserExist = await models.User.findOne({
        where: {
          token: reset_Token,
          token_expiration: { [Op.gt]: currentTime }
        }
      });


      if (!isUserExist) {
        return callback(400, { message: `Invalid reset token` });
      }

      const userEmail = isUserExist.dataValues.email;

      await models.User.update({
        password: await hash(password, 10),
        token_expiration: Date.now()
      }, {
        where: {
          email: userEmail
        }
      });


      const emailBody = `Your password has been reset successfully`;
      const emailSubject = `Password reset`


      await mailer.sendMail(emailBody, emailSubject, userEmail);
      return callback(200, { message: `Password reset success` });

    } catch (err) {
      return callback(500, { message: `something went wrong` });
    }
  },


};




