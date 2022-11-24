const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const models = require("../models");

module.exports = {
    // login API
    loginUser: async (req, res) => {
        try {
            if (!(req.body.password) || !(req.body.email || req.body.user_name)) {
                return res.status(400).json({ response: `All filed must required` });
            }
            const { email, password, user_name } = req.body;
            console.log(user_name);
            // check for valid request
            const user = await models.User.findOne({
                where: {
                    [Op.or]: [{ email: email }, { user_name: user_name }]
                }
            });
            console.log('Hello');

            if (!user) {
                return res.status(401).json({ response: `Wrong email or password` });
            }
            // check for correct password
            const match = await bcrypt.compareSync(password, user.password)
            if (!match) {
                return res.status(401).json({ response: `Wrong email or password` })
            }
            // jwt token assignment
            let jsonToken;
            if (email) jsonToken = jwt.sign({ email: email }, process.env.secretKey);
            else jsonToken = jwt.sign({ user_name: user_name }, process.env.secretKey);
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
        console.log(`hello`, req.body.email);
        const existingUser = await models.User.findOne({
            where: { email: req.body.email },
        });

        console.log({ existingUser });
        if (req.body.throwError) throw 500;
        if (existingUser) {
            return res
                .status(409)
                .json({ message: `User already exist, Please login` });
        }
        const { first_name, last_name, email, phone, user_name, password, role } =
            req.body;
        const user = await models.User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            user_name: req.body.user_name,
            password: await hash(req.body.password, 10),
            role: req.body.role,
        });
        return res.status(201).json({
            message: `User created`,
            first_name,
            last_name,
            email,
            phone,
            role,
        });
    },

    // get user details by id API
    userDetailsById: async (req, res) => {
        try {
            // check for valid request
            const existingUser = await models.User.findOne({ where: { id: req.params.id } });
            if (!existingUser) return res.status(404).json({ response: `User not found` });
            const user = await models.User.findOne({
                where: {
                    id: req.params.id
                },
                attributes: { exclude: ['token', 'is_delete'] },
            })
            return res.status(200).json({ response: user });
        } catch (err) {
            return res.status(500).json({ error: `Something went wrong!` });
        }

    },

    // filter users on basis of role
    filterUsers: async (req, res) => {
        try {
            let userRole = req.body.role;
            let role;
            if (userRole === "INTERN") role = "EMPLOYEE";
            else if (userRole === "EMPLOYEE") role = "LEAD";
            else return res.status(400).json({ message: `error` })
            const users = await models.User.findAll({
                where: {
                    role: role
                }
            })
            return res.status(200).json({ response: users });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: `Something went wrong!` });
        }
    },
    
    
    deactivateUser: async (req, res) => {
        try {
           
            let user_id=req.params.id;
            const existingUser = await models.User.findOne({ where: { id: user_id } });
            if (!existingUser) return res.status(404).json({ response: `User not found` });
            const user = await models.User.destroy({
                where: {
                  id: user_id
                }
              })
            return res.status(200).json({ response: "User deactivated successfully" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: `Something went wrong!` });
        }
    },
};
