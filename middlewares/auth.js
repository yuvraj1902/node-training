const { Op } = require("sequelize");
const models = require("../models");


module.exports = {
  checkToken: async (req, res, next) => {
    try {
      let token = req.headers["authorization"];
      if (token) {
        jwt.verify(token,process.env.secretKey, async function(err, decoded) {
            if(err){
              return res.status(401).json({
                error:"You are not authorized"
              })
            }
            const user = await models.User.findOne({
              where: {
                  email: decoded.email
              },
              include:models.Role
          })
          if(!user) return res.status(400).json({
            error:"User not found"
          })
         if(user){
              req.user=user.Roles[0].dataValues;
              next();
          }else{
            return res.status(403).json({
              error:"Access Denied"
            })
          }
        });
        if (user) {
          req.user = payload.email;
          next();
        } else return res.status(498).json({ response: "Invalid token" });
      } else {
        return res.status(401).json({ response: "Access denied" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Something went wrong!" });
    }
  },
};
