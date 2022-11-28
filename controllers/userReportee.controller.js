const models = require("../models");
const { addReportee } = require('../services/userReportee.service');

module.exports = {
  addReportee: async (req, res) => {
    try {
      const id = req.body.id;

      // check for valid request
      const existingUser = await models.User.findOne({ where: { id: id } });
      if (!existingUser)
        return res.status(404).json({ response: `User not found` });

      const findDesignation = await models.UserDesignationMapping.findOne({
        where: { user_id: id },
      });
      if (!findDesignation)
        return res
          .status(404)
          .json({ response: `Not assign any designation title to user.` });

      const users = await models.UserDesignationMapping.findAll({
        where: {
          designation_code: {
            [Op.gt]: findDesignation.designation_code,
          },
        },
        include: "users",
      });
      if (!users) return res.status(204).json({ message: "Content not found" });
      return res.status(200).json({ response: users });
    } catch (err) {
      return res.status(500).json({ error: `Something went wrong!` });
    }
  },
};
