const models = require("../models");
const prompt = require("prompt");

prompt.start();
 prompt.get(
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
         required:true
     },
     {
       name: "google_id",
       required:true
     },
     {
       name: "phone",
       required:true
     },
     {
       name: "user_name",
       required:true
     },
     {
       name: "source",
       required:true
     },
     {
       name: "role_title",
       description: colors.magenta("Role should be admin or user"),
       required: true,
       
     }, {
       name: "designation_user_mapping",
       required:true
     }
   ],
   async function (err, result) {
    const user = await models.User.create({
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email,
            phone: result.phone,
            user_name:result.user_name,
            password: await hash(result.password, 10),
    });
     
   }
 );
   
   