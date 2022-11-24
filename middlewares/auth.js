const { Op } = require("sequelize");
const models = require("../models");


module.exports = {
  checkToken: async (req, res, next) => {
    try {
      let token = req.headers["authorization"];
      if (token) {
        var payload = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString()
        );

        let currTime = Date.now();
        const user = await models.User.findOne({
          where: {
            [Op.or]: [{ email: email }, { user_name: user_name }],
            token: token,
            token_expiration: {
              [Op.gte]: currTime,
            },
          },
        });
        if (user) {
          req.user = payload.email;
          next();
        } else return res.status(498).json({ response: "Invalid token" });
      } else {
        return res.status(401).json({ response: "Access denied" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  },
};
