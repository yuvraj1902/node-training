module.exports = {
    verifyUser: async (req, res, next) => {
        try {
            if(req.user.role_code == 1001){
                next();
            }else{
                return res.status(403).json({
                    message:"Access Denied"
                })
            }
        } catch (err) {
            return res.status(500).json({ error: `Something went wrong!` });
        }
    }
}