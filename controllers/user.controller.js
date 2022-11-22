const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");

const models = require("../models");

module.exports = {
    // login API
    loginUser: async (req, res) => {
        try {
            if (!(req.body.password) || !(req.body.email || req.body.user_name)) {
                return res.status(400).json({ response: `All filed must required` });
            }
            const { email, password, user_name } = req.body;
            // check for valid request
            const user = await models.User.findOne({
                $or: [
                    { email: email },
                    { user_name: user_name }
                ]
            });
            if (!user) {
                return res.status(401).json({ response: `Wrong email or password` });
            }
            // check for correct password
            const match = await bcrypt.compareSync(password, user.password)
            if (!match) {
                return res.status(401).json({ response: `Wrong email or password` })
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
            return res.status(500).json({ error: `Something went wrong!` });
        }
    },

    createUser: async (req, res) => {
        const existingUser = await models.User.findOne({
            where: { email: req.body.email },
        });
        console.log({ existingUser });
        if (req.body.throwError) throw 500;
        if (existingUser) {
            return res
                .status(409)
                .json({ message: "User already exist, Please login" });
        }
        const { first_name, last_name, email, phone, user_name, password, is_admin } = req.body
        const user = await models.User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            user_name: req.body.user_name,
            password: await hash(req.body.password, 10),
            is_admin: "false",
        });

        return res
            .status(201)
            .json({ message: "User created" });
    },
};
