const models = require("./models");
const { sequelize } = require("./models");
const prompt = require("prompt");
const colors = require("@colors/colors/safe");
const { hash } = require("bcrypt");

async function admin() {
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
        // hidden: true,
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
        name: "is_firsttime",
        required: true
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
      const t = await sequelize.transaction();
      try {
        const data = await models.User.create(
          {
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email,
            organization: result.organization,
            google_id: result.google_id,
            source: result.source,
            password: await hash(result.password, 10),
            is_firsttime: result.is_firsttime
          },
          { transaction: t }
        );
        const designation = await models.Designation.findOne(
          {
            where: {
              designation_title: result.designation_title,
            },
          },
          { transaction: t }
        );

        const userId = data.dataValues.id;

        await models.UserDesignationMapping.create(
          {
            user_id: userId,
            designation_id: designation.id,
          },
          { transaction: t }
        );

        const role = await models.Role.findOne(
          {
            where: {
              role_title: result.role_title,
            },
          },
          { transaction: t }
        );

        await models.UserRoleMapping.create(
          {
            role_id: role.id,
            user_id: userId,
          },
          { transaction: t }
        );

        console.log(colors.cyan("You are good to go."));
        await t.commit();
      } catch (error) {
        console.log(error);
        await t.rollback();
      }
    }
  );
}

admin();
