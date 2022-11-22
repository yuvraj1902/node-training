const bcrypt = require('bcrypt');
const { hash } = require("bcrypt");
const jwt = require('jsonwebtoken');

const models = require('../models');

module.exports = {
    // login API
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            // check for valid request
            const user = await models.User.findOne({ where: { email: email } });
            if (!user) {
                return res.status(401).json({ response: 'Wrong email or password' });
            }
            // check for correct password
            const match = await bcrypt.compareSync(password, user.password)
            if (!match) {
                return res.status(401).json({ response: 'Wrong email or password' })
            }
            // jwt token assignment
            const jsonToken = jwt.sign({ email: email }, process.env.secretKey);
            const expirationTime = (Date.now() + (1 * 60 * 60 * 1000));
            await models.User.update({ token: jsonToken, token_expiration: expirationTime }, {
                where: {
                    id: user.id
                }
            })
            return res.status(200).json({ token: jsonToken });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: 'Something went wrong!' });
        }
    }
}
