const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");

const models = require("../models");
const { sequelize } = require("./models");
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
       const trans = await sequelize.transaction();
      const {
        first_name,
        last_name,
        email,
        password,
        organization,
        google_id,
        source,
      } = data;
      const user = await models.User.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: await hash(data.password, 10),
        organization: data.organization,
        google_id: data.google_id,
        source: data.source,
      },{transaction:trans});
      const userId = await models.User.findOne({
        where: {
          email: data.email,
        },
      });
      if (data.designation_title) {
        const designation = await models.Designation.findOne({
          where: {
            designation_title: data.designation_title,
          },
        },{transaction:trans});
        const designation_user_mapping_designationID =
          await models.UserDesignationMapping.create({
            designation_id: designation.id,
            user_id: userId.id,
          },{transaction:trans});
      }

      if (data.role_title) {
        const role = await models.Role.findOne({
          where: {
            role_title: data.role_title,
          },
        },{transaction:trans});
        const user_role_mapping = await models.UserRoleMapping.create({
          role_id: role.id,
          user_id: userId.id,
        },{transaction:trans});
      }
      await trans.commit();
      return callback({ message: "User Created" }, 201);
    } catch (error) {
      await trans.rollback();
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
