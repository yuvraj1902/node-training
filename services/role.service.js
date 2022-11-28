const models = require("../models");
module.exports = {
    createRole: async (data, callBack) => {
        const existingRole = await models.Role.findOne({
            where: { role_code: data.role_code },
        });
        if (existingRole) {
            return callBack(409, " Role already created ");
        }
        const { role_key, role_code, role_title } = data;
        const user = await models.Role.create({
            role_key: role_key,
            role_code: role_code,
            role_title: role_title,
        });
        return callBack(201, "role created");
    },
    changeRole: async (data, callBack) => {
        
        const { user_id , role_title } = data;

        const roleCheck=await models.Role.findOne(
            {
                where:{
                        role_title:role_title
                    }
            }
        )
        const user=await models.UserRoleMapping.update(
            {
                role_id:roleCheck.id
            },{
            where:{
                user_id:user_id
            }
            }
        )
        if(!user){
            return callBack(400,"User not Found");
        }else{
            return callBack(200,"Role updated successfully");
        }
    },
}