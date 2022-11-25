const models = require("./models");
const prompt = require("prompt");
const colors = require("@colors/colors/safe");
const { hash } = require("bcrypt");
(async function admin() {
  await prompt.start();

  await prompt.get(
    [
      {
        name: "first_name",
        required: true,
      },
      {
        name: "last_name",
        required: true,
      },
      {
        name: "email",
        required: true,
      },
      {
        name: "password",
        hidden: true,
        conform: function (value) {
          return true;
        },
      },
      {
        name: "organization",
        required: true,
      },
      {
        name: "google_id",
        required: true,
      },
      {
        name: "source",
        required: true,
      },
      {
        name: "role_title",
        description: colors.magenta("Role should be admin or user"),
        required: true,
      },
      {
        name: "designation_title",
        required: true,
      },
    ],
    async function (err, result) {
      const user = await models.User.create({
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email,
        organization: result.organization,
        google_id: result.google_id,
        source: result.source,
        password: await hash(result.password, 10),
      });
      const designation = await models.Designation.findOne({
        where: {
          designation_title: result.designation_title,
        },
      });

      const userId = await models.User.findOne({
        where: {
          email: result.email,
        },
      });
      const designation_user_mapping_designationID =
        await models.UserDesignationMapping.create({
          designation_id: designation.id,
          user_id: userId.id,
        });
      const role = await models.Role.findOne({
        where: {
          role_title: result.role_title,
        },
      });
      const user_role_mapping = await models.UserRoleMapping.create({
        role_id: role.id,
        user_id: userId.id,
      });

      console.log(colors.cyan("You are good to go."));
    }
  );
})();
