const registration= require("../services/user.service")

module.exports = {
    createUser: async (req, res,next) => {
    registration(req.body, (status_code,result) => {
            return res.status(status_code).json({
                message:result
            })
        })
        
    }
};

   

    
   
