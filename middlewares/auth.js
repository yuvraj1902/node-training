const models = require('../models')
const jwt = require('jsonwebtoken')
module.exports = {
  checkToken: async (req, res, next) => {
    try {
      // let token = req.headers["authorization"];
      let token = req.get("authorization");
      if (token) {
        token = token.slice(7);
        if (token) {
          jwt.verify(token, process.env.secretKey, async function (err, decoded) {
            if (err) {
              return res.status(401).json({
                error: "You are not authorized"
              });
            }
            const user = await models.User.findOne({
              where: {
                email: decoded.email
              },
              include: models.Role
            })
            if (!user) return res.status(404).json({
              error: "User not found"
            })
            if (user) {
              req.user = user;
              next();
            } else {
              return res.status(403).json({
                error: "Access Denied"
              })
            }
          });
        } else {
          return res.status(401).json({ response: "Access denied" });
        }

      } else {
        return res.status(401).json({ response: "Access denied" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Something went wrong!" });
    }
  },
};