const models = require("../models");

const createRole = async (payload) => {
  try {
    const existingRole = await models.Role.findOne({
      where: { role_code: payload.role_code },
    });
    if (existingRole) {
      throw new Error("Role already created");
    }
    const { role_key, role_code, role_title } = payload;
    await models.Role.create({
      role_key: role_key,
      role_code: role_code,
      role_title: role_title,
    });
    return {
      data: {
        message: `role created`,
      },
    };
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

const changeRole = async (payload) => {
  try {
    const { role_code } = payload;
    const roleCheck = await models.Role.findOne({
      where: {
        role_code: role_code,
      },
    });
    if (!roleCheck) {
      throw new Error("Role Not Found");
    }
    await models.Role.update(payload, {
      where: {
        role_code: role_code,
      },
    });
    return {
      data: { message: `Role updated successfully` },
    };
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
module.exports = {
    createRole,
    changeRole
}
