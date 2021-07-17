const express = require('express');
const router = express.Router();

const UsersContoller = require('./../app/controllers/UsersController');

const pagination = require('../app/requests/pagination');
const getUserByIdValidator = require('../app/requests/Users/GetByIdValidator');
const updateUserValidator = require('./../app/requests/Users/UpdateUserValidator');
const resetPasswordValidator =require('./../app/requests/Users/ResetPasswordValidator');

const authenticateJWT = require('./../app/middlewares/AuthenticateJWT');
const validate = require('../app/middlewares/Validate');

/* GET users listing. */
router.get('/', pagination, validate, UsersContoller.getUsers)

router.get('/:id', getUserByIdValidator, validate, UsersContoller.getUserById)

router.put('/:id', authenticateJWT, updateUserValidator, validate, UsersContoller.updateUser)

router.put('/:id/reset-password', authenticateJWT, resetPasswordValidator, validate, UsersContoller.resetPassword)

module.exports = router;
