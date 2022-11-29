const models = require("../models");

module.exports = {
    createDesignation: async (data, callBack) => {
        const { designation_code, designation_title } = data;
        const designation = await models.Designation.create({
            designation_code: designation_code,
            designation_title: designation_title,
        });
        return callBack(201, {message:"Designation created"});
    },

    changeDesignation: async (data, callBack) => {
        const { user_id, designation_title } = data;
        const designationCheck = await models.Designation.findOne(
            {
                where: {
                    designation_title: designation_title
                }
            }
        )
        const user = await models.UserDesignationMapping.update(
            {
                designation_id: designationCheck.id
            }, {
            where: {
                user_id: user_id
            }
        }
        )
        if (!user) {
            return callBack(400, {error:"User not Found"});
        } else {
            return callBack(202, {message:"designation updated successfully"});
        }
    },
}