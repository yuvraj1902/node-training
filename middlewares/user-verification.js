const models = require('../models');

module.exports = {
    verifyUser: async (req, res, next) => {
        try {
            const user = await models.User.findOne({
                where: {
                    email: req.email
                }
            })
            if (user.is_admin) {
                next();
            } else {
                return res.status(403).json({ response: 'Access denied' });
            }
        } catch (err) {
            return res.status(500).json({ error: `Something went wrong!` });
        }

    }
}