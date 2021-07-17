const express = require('express');
const router = express.Router();

const AuthController = require('./../app/controllers/AuthController');

const authenticateJWT = require('./../app/middlewares/AuthenticateJWT');
const validate = require('../app/middlewares/Validate');

const getLoggedInUserValidator = require('./../app/requests/Auth/GetLoggedInUserValidator');
const loginValidator = require('./../app/requests/Auth/LoginValidator');
const registerValidator = require('./../app/requests/Auth/RegisterValidator');

router.get('/user', authenticateJWT, getLoggedInUserValidator, validate, AuthController.getUser)
router.post('/login', loginValidator, validate, AuthController.login)
router.post('/register', registerValidator, validate, AuthController.register)
router.get('/revoke-token', authenticateJWT, AuthController.revokeToken)

module.exports = router;
