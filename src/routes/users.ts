const express = require('express');
const router = express.Router();

import UsersController from "@/app/controllers/UsersController";
import GetUserByIdValidator from "@/app/requests/Users/GetUserByIdValidator";
import UpdateUserValidator from "@/app/requests/Users/UpdateUserValidator";
import ResetPasswordValidator from "@/app/requests/Users/ResetPasswordValidator";

import AuthenticateJWT from "@/app/middlewares/AuthenticateJWT";
import Validate from "@/app/middlewares/Validate";

/* GET users listing. */
router.get('/', AuthenticateJWT, Validate, UsersController.getUsers);
router.get('/:id', GetUserByIdValidator, Validate, UsersController.getUserById);
router.put('/:id', AuthenticateJWT, UpdateUserValidator, Validate, UsersController.updateUser);
router.put('/:id/reset-password', AuthenticateJWT, ResetPasswordValidator, Validate, UsersController.resetPassword);

module.exports = router;