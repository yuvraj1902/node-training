module.exports = {
    verifyUser: async (req, res, next) => {
        try {
            if (req.user.role.role_code == 1001) {
                next();
            } else {
                return res.status(403).json({ message: 'Access denied' });
            }
        } catch (err) {
<<<<<<< HEAD
            return res.status(500).json({ message: `Something went wrong!` });
=======
            console.log(err);
            return res.status(500).json({ error: `Something went wrong!` });
>>>>>>> 496d558 (BugFix/create-user-API)
        }

    }
}