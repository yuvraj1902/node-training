const models=require('../models')
const jwt=require('jsonwebtoken')
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
              }
          })
          if(!user) return res.status(400).json({
            error:"User not found"
          })
          const role=await models.UserRoleMapping.findOne({
              where:{
                  user_id:user.id
              }
          })

          if(role){
              req.user=role;
              next();
          }else{
            return res.status(403).json({
              error:"Access Denied"
            })
          }
        });
      } else {
        return res.status(401).json({ response: "Access denied" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  },
};

