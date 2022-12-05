const models = require("../models");

const assignDesignation = async (payload) => {
    const { user_id, designation_code } = payload;

    const designation = await models.Designation.findOne({
        where: {
            designation_code: designation_code
        }
    });
    payload.designation_id = designation.id;
    if (!designation) {
        throw new Error('Invalid Designation!');
    }
    
    const user = await models.User.findOne({
        where: {
            id: user_id
        }
    });
    if (!user) {
        throw new Error('User Not Found!');
    }

    const userDesignationMapping = await models.UserDesignationMapping.create(payload);
    return userDesignationMapping;
}

module.exports = {
    assignDesignation
}