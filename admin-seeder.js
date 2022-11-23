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
   ],
   function (err, result) {
     //
     // Log the results.
     //
     console.log("Command-line input received:");
     console.log("  username: " + result.username);
     console.log("  password: " + result.password);
   }
 );
   
   