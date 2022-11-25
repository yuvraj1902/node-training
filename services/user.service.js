const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const models = require("../models");

module.exports = {
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
};
