const {registration}= require("../services/user.service")

module.exports = {
    // login API
    
    createUser: async (req, res,next) => {

        registration(req.body, (data, result) => {
            let value = result;
            next();
        })
        
    }
};

   

    
   
