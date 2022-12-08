const jwt = require('jsonwebtoken')
const models = require('../models')
const checkToken= async (req, res, next) => {
    try {
      const header = req.headers["authorization"];
      const token = (header ? header.split(' ')[1] : null);
      if (!token) {
        throw new Error('Access denied');
      }
      const decoded_jwt = jwt.verify(token, process.env.secretKey);
      const user = await models.User.findOne({
        where: {
                id: decoded_jwt.userId
              },
              include: models.Role
      });
      if(!user) {
        throw new Error('User Not found');
      }
      req.user = user;
     
      next();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
module.exports = {
  checkToken
};