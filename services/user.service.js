const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../helper/sendmail");
const models = require("../models");
const user = require("../models/user");
const mailer = require("../helper/sendmail");



module.exports = {

    // Login
    loginUser: async (data, callback) => {
        try {
            const { email, password } = data;
            const userWithEmail = await models.User.findOne({
                where: {
                    email: email
                }
            });

            if (!userWithEmail) {
                return callback(401, { message: `Credentials are invalid!` });
            }
            // check for correct password
            const match = await bcrypt.compareSync(password, userWithEmail.password);
            if (!match) {
                return callback(401, { message: `Wrong email or password` });
            }

            // jwt token assignment
            const jsonToken = jwt.sign({ email: email }, process.env.secretKey);
            const expirationTime = (Date.now() + (1 * 60 * 60 * 1000));
            await models.User.update({ token: jsonToken, token_expiration: expirationTime }, {
                where: {
                    id: userWithEmail.id
                }
            })
            return callback(200, { token: jsonToken });
        } catch (error) {
            return callback(500, { message: `Something went wrong!` });
        }
    },

  createUser: async (data, callback) => {
    try {
      const existingUser = await models.User.findOne({
        where: { email: data.email },
      });

      if (existingUser) {
        return callback({ message: "User already exists" }, 409);
      }
      const {
        first_name,
        last_name,
        email,
        password,
        organization,
        google_id,
        source,
        role_title,
        designation_title,
      } = data;
      const user = await models.User.create(
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: await hash(data.password, 10),
          organization: data.organization,
          google_id: data.google_id,
          source: data.source,
        },
        { exclude: "password" }
      );
      const designation = await models.Designation.findOne({
        where: {
          designation_title: data.designation_title,
        },
      });

      const userId = await models.User.findOne({
        where: {
          email: data.email,
        },
      });

      const designation_user_mapping_designationID =
        await models.UserDesignationMapping.create({
          designation_id: designation.id,
          user_id: userId.id,
        });
      const role = await models.Role.findOne({
        where: {
          role_title: data.role_title,
        },
      });
      const user_role_mapping = await models.UserRoleMapping.create({
        role_id: role.id,
        user_id: userId.id,
      });

      return callback({ message: "User Created" }, 201);
    } catch (error) {
      return callback({ error: error }, 500);
    }
  },
     

    deactivateUser: async (data, callback) => {
        try {

            let user_id = data.user_id;
            const existingUser = await models.User.findOne({ where: { id: user_id } });
            if (!existingUser) return callback(404, "User not found ")
            const user = await models.User.destroy({
                where: {
                    id: user_id
                }
            })
            return callback(202, `User deactivate successfully`);
        } catch (err) {
            console.log(err);
            return callback(500, `Something went wrong!`);
        }
    },
    enableUser: async (data, callback) => {
        try {

            let user_id = data.user_id;
            const user = await models.User.restore({
                where: {
                    id: user_id
                }
            })
            if (!user) return callback(404, "User not found ")
            return callback(202, `User activated again`);
        } catch (err) {
            console.log(err);
            return callback(500, `Something went wrong!`);
        }
    },
   userDetail: async (data, callback) => {
        try {
            let user_id = data.user_id;
            const user = await models.User.findOne({
                where: {
                    id: user_id
                },

                include: models.Designation
            })
            const user2 = await models.User.findOne({
                where: {
                    id: user_id
                },

                include: models.Role
            })
            if (!user) return callback(400, { error: " User not found" });
            const reportee = await models.UserReportee.findAll({
                where: {
                    reportee_id: user_id
                },
            })
            if (!reportee[0]) return callback(404, { error: " User not assigned as a reportee yet " })
            const manager = await models.User.findOne({
                where: {
                    id: reportee[0].manager_id
                },
            })
            if (manager) {
                return callback(202, {
                    message: {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        google_id: user.google_id,
                        organization: user.organization,
                        source: user.source,
                        designation_title: user.Designations[0].dataValues.designation_title,
                        role_title: user2.Roles[0].dataValues.role_title,
                        manager_first_name: manager.first_name,
                        manager_last_name: manager.last_name,
                        manager_email:manager.email,
                        created_at: user.created_at,
                        updated_at: user.updated_at,
                        deleted_at: user.deleted_at
                    }
                });
            } else {
                console.log("hello")
            }
        } catch (err) {
            console.log(err);
            return callback(500, `Something went wrong!`);
        }
    },


  forgetPassword: async (data, callback) => {

    let expirationTime = (Date.now() + (60 *1000 *20));
    let email = data.email;

    try {
      const existingUser = await models.User.findOne({ where: { email: email } });
      if (!existingUser) { return callback(404, { response: "User not found " }); }
    
      let tokenData = {
        email: email,
        expirationtime: Date.now()
      }
    
      let userToken = jwt.sign(JSON.stringify(tokenData), process.env.secretKey);
      let token = `http://localhost:3004/resetUserPassword?token=${userToken}`;

     
      const user = await models.User.update(
        {
          token_expiration: expirationTime,
          token:userToken 
        },
        { where: { email: email } }
      );

      let recipient = email;
      let subject = "Reset Password Link"
      let body = `Password reset link- ${token}`;

      await mailer.sendMail(body, subject,recipient )
      return callback(200, { response: "password reset link sent" });

    }
    catch (err) {
      console.log(err);
      return callback(500, { error: "Something went wrong!" });
    }
  },

  getAllUsers: async (callback) => {
    try {
      const user = await models.User.findAll({
        attributes: { exclude: ['password', 'token', 'token_expiration', 'updated_at', 'deleted_at' ] },
      });
      
      return callback(200, { data: user });
      
    } catch (err) {
      console.log(err);
      return callback(500, { error: "Something went wrong!" });
    }
  },
  userInfo: async (userEmail, callback) => {
    try {
      console.log(userEmail);
      const userDetails = await models.User.findOne(
        { where: { email: userEmail } });
      console.log(userDetails.dataValues);

      const userManagerDetails = await models.UserReportee.findAll({ where: { reportee_id: userDetails.dataValues.id } });
      console.log(userManagerDetails);

      const mangerDetailsArray = [];
      for (let i = 0; i < userManagerDetails.length; ++i) {
        const userDetails = await models.User.findOne(
          { where: { id: userManagerDetails[i].dataValues.manager_id } });
        
        const mangerDetails = {
          firstName: userDetails.dataValues.first_name,
          lastName: userDetails.dataValues.last_name,
          email: userDetails.dataValues.email
        }

        mangerDetailsArray.push(mangerDetails);
      }


      const userInfo = {
        firstName: userDetails.dataValues.first_name,
        lastName: userDetails.dataValues.last_name,
        email: userDetails.dataValues.email,
        organization: userDetails.dataValues.organization,
        google_id: userDetails.dataValues.organization,
        image_url: userDetails.dataValues.image_url,
        source: userDetails.dataValues.source,
        managers: mangerDetailsArray
      }

      console.log(userInfo);
      
      return callback(200, { response: userInfo });
    } catch (err) {
      console.log(err);
      return callback(500, `Something went wrong!`);
    }
  },
  resetUserPassword: async (query,data, callback) => {
    try {
      const reset_Token = query.token;
      const password = data.password;

      const isUserExist = await models.User.findOne({
        where: {
          [Op.and]: [
            { token: reset_Token },
            { [Op.gt]: Date.now() }
          ]
        }
      });

      if (!isUserExist) {
        return callback(400, "Invalid reset token");
      }

      await models.User.update({ password: await hash(password, 10) }, {
        where: {
          email:isUserExist.dataValues.email
        }
      });
      

      const emailBody = `Your password has been reset successfully`;
      const emailSubject = `Password reset`
      await mailer.sendMail(emailBody, emailSubject, isUserExist.dataValues.email);
      return callback(200,"Password reset success");

    } catch (err) {
      return callback(500,`something went wrong`);
    }
  }

}


