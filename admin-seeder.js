const { sequelize } = require("./models");
const models = require("./models");
const prompt = require("prompt");
const colors = require("@colors/colors/safe");
const { hash } = require("bcrypt");
const { req } = require("./utility/serializers");

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
        name: "role_key",
        description: colors.magenta("Role should be ADM or USR"),
        required: true,
      },
      {
        name: "designation_code",
        description: colors.magenta("Designation 101 - 4"),
        required: true,
      },
    ],
    async function (err, result) {
      result.role_key = result.role_key.toUpperCase();
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
              designation_code: result.designation_code,
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
              role_key: result.role_key,
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
        await t.rollback();
      }
    }
  );
}

admin();