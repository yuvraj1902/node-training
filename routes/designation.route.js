const { Router } = require('express');
const router = Router();

const controllers = require('../controllers');
const { checkToken } = require('../middlewares/auth');
const { verifyUser } = require('../middlewares/user-verification');
const validator = require('../validators');
const genericResponse = require('../helper/generic-response');


router.post(
    '/assign-designation',
    checkToken,
    verifyUser,
    validator.designationValidator.assignDesignationSchema,
    controllers.Designation.assignDesignation,
    genericResponse.sendResponse
);
router.patch(
    '/change-designation',
    checkToken,
    verifyUser,
    validator.designationValidator.assignDesignationSchema,
    controllers.Designation.assignDesignation,
    genericResponse.sendResponse
);

module.exports = router;