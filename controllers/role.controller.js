const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const createRole=require("../services/role.service")
module.exports={
createRoles : (req, res) => {
    createRole(req.body, (result, status_code) => {
        return res.status(status_code).json(result);
    });
}
}
