const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models");
const mailer = require("../helper/sendmail");
const { Op } = require("sequelize");


module.exports = {

  // Login
  loginUser: async (data, callback) => {
    try {
      const { email, password } = data;
      const userWithEmail = await models.User.findOne({
        where: {
          email: email
        }
      });

      if (!userWithEmail) {
        return callback(401, { message: `Credentials are invalid!` });
      }
      // check for correct password
      const match = await bcrypt.compareSync(password, userWithEmail.password);
      if (!match) {
        return callback(401, { message: `Wrong email or password` });
      }

      // jwt token assignment
      const jsonToken = jwt.sign({ email: email }, process.env.secretKey);
      const expirationTime = (Date.now() + (1 * 60 * 60 * 1000));
      await models.User.update({ token: jsonToken, token_expiration: expirationTime }, {
        where: {
          id: userWithEmail.id
        }
      })
      return callback(200, { token: jsonToken });
    } catch (error) {
      return callback(500, { message: `Something went wrong!` });
    }
  },

  createUser: async (data, callback) => {
    try {
      const existingUser = await models.User.findOne({
        where: { email: data.email },
      });

      if (existingUser) {
        return callback({ message: "User already exists" }, 409);
      }
      const {
        first_name,
        last_name,
        email,
        password,
        organization,
        google_id,
        source,
        role_title,
        designation_title,
      } = data;
      const user = await models.User.create(
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: await hash(data.password, 10),
          organization: data.organization,
          google_id: data.google_id,
          source: data.source,
        },
        { exclude: "password" }
      );
      const designation = await models.Designation.findOne({
        where: {
          designation_title: data.designation_title,
        },
      });

      const userId = await models.User.findOne({
        where: {
          email: data.email,
        },
      });

      const designation_user_mapping_designationID =
        await models.UserDesignationMapping.create({
          designation_id: designation.id,
          user_id: userId.id,
        });
      const role = await models.Role.findOne({
        where: {
          role_title: data.role_title,
        },
      });
      const user_role_mapping = await models.UserRoleMapping.create({
        role_id: role.id,
        user_id: userId.id,
      });

      return callback({ message: "User Created" }, 201);
    } catch (error) {
      return callback({ error: error }, 500);
    }
  },

  deactivateUser: async (data, callback) => {
    try {

      let user_id = data.id;
      const existingUser = await models.User.findOne({ where: { id: user_id } });
      if (!existingUser) return callback(404, "User not found ")
      const user = await models.User.destroy({
        where: {
          id: user_id
        }
      })
      return callback(202, `User deactivate successfully`);
    } catch (err) {
      console.log(err);
      return callback(500, `Something went wrong!`);
    }
  },

  resetUserPassword: async (query,data, callback) => {
    try {
      const reset_Token = query.token;
      const password = data.password;

      console.log(reset_Token, password);

      const currentTime = Date.now();
      console.log(currentTime);
      const isUserExist = await models.User.findOne({
        where: {
          token: reset_Token,
          token_expiration: {[Op.gt]:currentTime}
        }
      });


      if (!isUserExist) {
        return callback(400, { response: "Invalid reset token" });
      }

      const userEmail = isUserExist.dataValues.email;

      await models.User.update({
        password: await hash(password, 10),
        token_expiration: Date.now()
      }, {
        where: {
          email:userEmail
        }
      });
      

      const emailBody = `Your password has been reset successfully`;
      const emailSubject = `Password reset`
      

      await mailer.sendMail(emailBody, emailSubject, userEmail);
      return callback(200, { response: "Password reset success" });

    } catch (err) {
      return callback(500, { error: `something went wrong` });
    }
  }


};
