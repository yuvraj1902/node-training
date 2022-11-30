const models = require('../models');
const { sequelize, User } = require('../models');


const getUserByEmail = async (email) => {
    const user = await User.findOne({
        where: {
          email: email
        }
    });

    if (!user) {
        throw new Error('Credentials are invalid!');
    }

    return user;
}

module.exports =  {
    getUserByEmail
}