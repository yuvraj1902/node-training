const jwt = require('jsonwebtoken')

const models = require('../models')

module.exports = {
  checkToken: async (req, res, next) => {
    try {
<<<<<<< HEAD
      // let token = req.headers["authorization"];
      let token = req.get("authorization");
=======
      let token = req.get('authorization');
>>>>>>> feature/temp
      if (token) {
        token = token.slice(7);
        if (token) {
          jwt.verify(token, process.env.secretKey, async function (err, decoded) {
            if (err) {
              return res.status(401).json({
<<<<<<< HEAD
                error: "You are not authorized"
=======
                message: `You are not authorized`
>>>>>>> feature/temp
              });
            }
            const user = await models.User.findOne({
              where: {
                email: decoded.email
              },
              include: models.Role
<<<<<<< HEAD
            })
            if (!user) return res.status(404).json({
              error: "User not found"
            })
=======
            });
            if (!user) return res.status(404).json({
              message: `User not found`
            })
>>>>>>> feature/temp
            if (user) {
              req.user = user;
              next();
            } else {
              return res.status(403).json({
<<<<<<< HEAD
                error: "Access Denied"
              })
            }
          });
        } else {
          return res.status(401).json({ response: "Access denied" });
=======
                message: `Access Denied`
              });
            }
          });
        } else {
          return res.status(401).json({ message: `Access denied` });
>>>>>>> feature/temp
        }

      } else {
        return res.status(401).json({ message: `Access denied` });
      }
    } catch (err) {
<<<<<<< HEAD
      return res.status(500).json({ error: "Something went wrong!" });
=======
      return res.status(500).json({ message: `Something went wrong!` });
>>>>>>> feature/temp
    }
  },
};