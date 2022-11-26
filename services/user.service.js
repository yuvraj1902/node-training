const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");


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

  registration: async (data, callback) => {
    try {
      const existingUser = await models.User.findOne({
        where: { email: data.email },
      });
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
      const user = await models.User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        user_name: req.body.user_name,
        password: await hash(req.body.password, 10),
        organization: data.organization,
        google_id: data.google_id,
        source: data.source,
      });
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
        await models.DesignationUserMapping.create({
          designation_id: designation.designation_code,
          user_id: userId.id,
        });
      const role = await models.Role.findOne({
        where: {
          role_title: result.role_title,
        },
      });
      const user_role_mapping = await models.UserRoleMapping.create({
        role_code: role.role_code,
        user_id: userId.id,
      });

      return callback({ user: user }, 201);
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
  }
};
