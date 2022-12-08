const models = require("../models");

const assignDesignation = async (payload) => {
    const { userId, designationCode } = payload;

    const designation = await models.Designation.findOne({
        where: {
            designation_code: designationCode
        }
    });

    if (!designation) {
        throw new Error('Invalid Designation!');
    }

    payload.designation_id = designation.id;
    
    const user = await models.User.findOne({
        where: {
            id: userId
        }
    });
    if (!user) {
        throw new Error('User Not Found!');
    }

    const userDesignationMapping = await models.UserDesignationMapping.create({
        user_id: userId,
        designation_id: payload.designation_id
    });
    return userDesignationMapping;
}

const deactivateDesignation = async (payload) => {
    const { userId, designationCode } = payload;
    console.log(designationCode);
    const designation = await models.Designation.findOne({
        where: {
            designation_code: designationCode
        }
    });
    
    if (!designation) {
        throw new Error('Invalid Designation!');
    }

    const user = await models.User.findOne({
        where: {
            id: userId
        }
    });
    if (!user) {
        throw new Error('User Not Found!');
    }

    const existingDesignation = await models.UserDesignationMapping.findOne({
        where: {
            user_id: userId,
            designation_id: designation.id
        }
    });

    if (!existingDesignation) throw new Error('Not Found!');

    const userDesignationMapping = await models.UserDesignationMapping.destroy({
        where: {
            user_id: userId,
            designation_id: designation.id
        }
    });
    
    return userDesignationMapping;
}

module.exports = {
    assignDesignation,
    deactivateDesignation
}