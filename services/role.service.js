const models = require("../models");
module.exports={
    createRole: async (data,callBack) => {
        const existingRole = await models.Role.findOne({
            where: { role_code: data.role_code },
        });
        if (existingRole) {
            return callBack(409," Role already created ");
        }
        const {role_key,role_code,role_title } = data;
        const user = await models.Role.create({
            role_key: data.role_key,
            role_code: data.role_code,
            role_title: data.role_title,
        });
        return callBack(201,"role created"); 
    },
}