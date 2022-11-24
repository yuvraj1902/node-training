const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const models = require("../models");

module.exports={

    createRole: async (req, res) => {
        const existingRole = await models.Roles.findOne({
            where: { email: req.body.role_code },
        });
        if (req.body.throwError) throw 500;
        if (existingRole) {
            return res
                .status(409)
                .json({ message: `Role already exist` });
        }
        const {role_key,role_code,role_title } = req.body;
        const user = await models.Roles.create({
            role_key: req.body.role_key,
            role_code: req.body.role_code,
            role_title: req.body.role_title,
        });
        return res.status(201).json({
            message: `Role created`
        });
    },


}