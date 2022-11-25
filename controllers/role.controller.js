
const {createRole}=require("../services/role.service")
module.exports={
createRoles : (req, res , next) => {
    createRole(req.body, (statusCode,result) => {
        req.statusCode = statusCode;
        req.result = result;
        next();
    });
}
}
