const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const models = require("../models");

module.exports = {
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
      } = data;
      const user = await models.User.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: await hash(data.password, 10),
        organization: data.organization,
        google_id: data.google_id,
        source: data.source,
      });
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
        });
        const designation_user_mapping_designationID =
          await models.UserDesignationMapping.create({
            designation_id: designation.id,
            user_id: userId.id,
          });
      }

      if (data.role_title) {
        const role = await models.Role.findOne({
          where: {
            role_title: data.role_title,
          },
        });
        const user_role_mapping = await models.UserRoleMapping.create({
          role_id: role.id,
          user_id: userId.id,
        });
      }

      return callback({ message: "User Created" }, 201);
    } catch (error) {
      console.log(error);
      return callback({ error: error }, 500);
    }
  },
};
