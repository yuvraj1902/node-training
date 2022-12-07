
const models = require("../models");

const assignDesignation = async (payload) => {
    const { user_id, designation_code } = payload;

    const designation = await models.Designation.findOne({
        where: {
            designation_code: designation_code
        }
    });

    if (!designation) {
        throw new Error('Invalid Designation!');
    }

    payload.designation_id = designation.id;
    
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

const deactiveDesignation = async (payload) => {
    const { user_id, designation_code } = payload;

    const designation = await models.Designation.findOne({
        where: {
            designation_code: designation_code
        }
    });

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

    const existingDesignation = await models.UserDesignationMapping.findOne({
        where: {
            user_id: user_id,
            designation_id: designation.id
        }
    });

    if (!existingDesignation) throw new Error('Not Found!');

    await models.UserDesignationMapping.destroy({
        where: {
            user_id: user_id,
            designation_id: designation.id
        }
    });
    
    return userDesignationMapping;
}

module.exports = {
    assignDesignation,
    deactiveDesignation
}