const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../helper/sendmail");
const models = require("../models");

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

  forgetPassword: async (data, callback) => {
    let email = data.email;
    try {
      const existingUser = await models.User.findOne({ where: { email: email } });
      if (!existingUser) { return callback(404, { response: "User not found " }); }
       
       let expirationTime = (Date.now());
      let tokenData = {
        email: email,
        expirationTime: expirationTime
      }
    
      let userToken = jwt.sign(tokenData, process.env.secretKey);
      let token = `http://localhost:3004/resetUserPassword?token=${userToken}`;

     
      const user = await models.User.update(
        {
          token_expiration: expirationTime,
          token:userToken 
        },
        { where: { email: email } }
      );

      let recipient = email;
      let subject = "Reset Password Link"
      let body = `Password reset link- ${token}`;

      await mailer.sendMail(body, subject,recipient )
      return callback(200, { response: "password reset link sent" });

    }
    catch (err) {
      console.log(err);
      return callback(500, { error: "Something went wrong!" });
    }
  },

  getAllUsers: async (callback) => {
    try {
      const user = await models.User.findAll({
        attributes: { exclude: ['password', 'token', 'token_expiration'] },
      });
      
      return callback(200, { data: user });
      
    } catch (err) {
      console.log(err);
      return callback(500, {error: "Something went wrong!" });
    }
  }

}


