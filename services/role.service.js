const models = require("../models");
module.exports={
    createRole: async (data,callBack) => {
        const existingRole = await models.Role.findOne({
            where: { email: data.role_code },
        });
        if (existingRole) {
            return callBack(" Role already created ",409);
        }
        const {role_key,role_code,role_title } = data;
        const user = await models.Role.create({
            role_key: data.role_key,
            role_code: data.role_code,
            role_title: data.role_title,
        });
        return callBack("role created",201); 
    },
}