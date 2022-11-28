
const {changeDesignation,createDesignation}=require("../services/designation.service");

module.exports={
    createDesignations : (req, res , next) => {
        createDesignation(req.body, (statusCode,result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        });
    },
    changeDesignations : (req, res , next) => {
        changeDesignation(req.body, (statusCode,result) => {
            req.statusCode = statusCode;
            req.result = result;
            next();
        });
    }
    }