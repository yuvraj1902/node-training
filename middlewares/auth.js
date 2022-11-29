const jwt = require('jsonwebtoken')

const models = require('../models')

module.exports = {
  checkToken: async (req, res, next) => {
    try {
      let token = req.get('authorization');
      if (token) {
        token = token.slice(7);
        if (token) {
          jwt.verify(token, process.env.secretKey, async function (err, decoded) {
            if (err) {
              return res.status(401).json({
                message: `You are not authorized`
              });
            }
            const user = await models.User.findOne({
              where: {
                email: decoded.email
              },
              include: models.Role
            });
            if (!user) return res.status(404).json({
              message: `User not found`
            })
            if (user) {
              req.user = user;
              next();
            } else {
              return res.status(403).json({
                message: `Access Denied`
              });
            }
          });
        } else {
          return res.status(401).json({ message: `Access denied` });
        }

      } else {
        return res.status(401).json({ message: `Access denied` });
      }
    } catch (err) {
      return res.status(500).json({ message: `Something went wrong!` });
    }
  },
};