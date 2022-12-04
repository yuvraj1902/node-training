const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const models = require("../models");
const { sequelize } = require("../models");
const mailer = require("../helper/sendmail");
const {addReportee}= require("./userReportee.service")
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

  const userRoles = await models.UserRoleMapping.findAll({
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
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const createUser = async (payload) => {
  const trans = await sequelize.transaction();
  try {
    const existingUser = await models.User.findOne({
      where: { email: payload.email },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const user = await models.User.create(
      {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        password: await hash(payload.password, 10),
        organization: payload.organization,
        google_id: payload.google_id,
        source: payload.source,
        is_firsttime: true,
      },
      { transaction: trans }
    );

    if (!user) {
      await trans.rollback();
      throw new Error("Something went wrong");
    }
    const userId = user.dataValues.id;
    console.log("hiiii",userId);
    if (payload.designation_title) {
      const designation = await models.Designation.findOne(
        {
          where: {
            designation_title: payload.designation_title,
          },
        },
        { transaction: trans }
      );
      if (!designation) {
        await trans.rollback();
        throw new Error("Invalid Designation");
      }
      console.log("innnnnnnnnn",userId);
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
       throw new Error("Something went wrong");
      }
    }
    if (payload.role_title) {
      const role = await models.Role.findOne(
        {
          where: {
            role_title: payload.role_title,
          },
        },
        { transaction: trans }
      );

      if (!role) {
        await trans.rollback();
      throw new Error("Invalid Role");
      }
      console.log("jiiiiiiiiiiiiiii",userId);
      const user_role_mapping = await models.UserRoleMapping.create(
        {
          user_id: userId,
          role_id: role.id
        },
        { transaction: trans }
      );

      if (!user_role_mapping) {
        await trans.rollback();
        throw new Error("Something went wrong");
      }
    }
    await trans.commit();
    if (payload.reportee_id) {
      return adminAddReportee(
        { manager_id: userId, reportee_id: payload.reportee_id },
      );
    } else {
      return {
        first_name: payload.first_name,
        last_name:payload.last_name,
        email: payload.email,
        organization: payload.organization,
        google_id: payload.google_id,
        source: payload.source,
        role: payload.role_title,
        designation:payload.designation_title
        
      }
    }
  } catch (error) {
    console.log(error);
    await trans.rollback();
   throw new Error("Something went wrong");
  }
};

const registration = async (payload) => {
  try {
      const existingUser = await models.User.findOne({
        where: { email: payload.email },
      });
      if (existingUser) {
        throw new Error("User already exists");
      }
     const user = await models.User.create(
      {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        password: await hash(payload.password, 10),
        organization: payload.organization,
        google_id: payload.google_id,
        source: payload.source,
        is_firsttime: true,
      });
   return {
        first_name: payload.first_name,
        last_name:payload.last_name,
        email: payload.email,
        organization: payload.organization,
        google_id: payload.google_id,
        source: payload.source,
        role: payload.role_title,
        designation:payload.designation_title
        
      }
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }


module.exports = {
  loginUser,
  createUser,
  registration
};
