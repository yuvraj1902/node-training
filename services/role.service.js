const models = require('../models');

module.exports = {

    createRole: async (data, callback) => {
        try {
            const existingRole = await models.Role.findOne({
                where: { role_code: data.role_code },
            });
            if (existingRole) {
                return callback(409, { message: `Role already created` });
            }
            const { role_key, role_code, role_title } = data;
            await models.Role.create({
                role_key: role_key,
                role_code: role_code,
                role_title: role_title,
            });
            return callback(201, { message: `role created` });
        } catch (error) {
            return callback(500, { message: `Something went wrong!` });
        }
    },


    changeRole: async (data, callback) => {
        try {
            const { role_code } = data;
            const roleCheck = await models.Role.findOne({
                where: {
                    role_code: role_code
                }
            });
            if (!roleCheck) {
                return callback(404, { message: `Role not Found` });
            }
            await models.Role.update(data, {
                where: {
                    role_code: role_code
                }
            });
            return callback(200, { message: `Role updated successfully` });

        } catch (error) {
            return callback(500, { message: `Something went wrong!` });
        }
    },
}