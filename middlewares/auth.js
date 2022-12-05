const jwt = require('jsonwebtoken');

const models = require('../models');

module.exports = {
  checkToken: async (req, res, next) => {
    try {
      let token = req.get('authorization');

      if (!token) return res.status(401).json({ message: `Access denied` });

      token = token.slice(7);

      if (!token) return res.status(401).json({ message: `Access denied` });

      jwt.verify(token, process.env.secretKey, async function (err, decoded) {
        if (err) {
          return res.status(401).json({message: `You are not authorized`});
        }
        const user = await models.User.findOne({
          where: {
            id: decoded.userId
          },
          include: models.Role
        });
        if (!user) return res.status(404).json({
          message: `User not found`
        })
        req.user = user;
        next();
      });
    }  catch (error) {
      return res.status(500).json({ message: `Something went wrong!` });
    }
  },
};