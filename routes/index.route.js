const { Router } = require('express');
const controllers = require('../controllers');
const router = Router();

router.post('/login', controllers.User.loginUser);


module.exports = router;

