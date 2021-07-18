import {Router} from "express";

import AuthController from "@/app/controllers/AuthController";
import authenticateJWT from "@/app/middlewares/AuthenticateJWT";
import validate from "@/app/middlewares/Validate";

import getLoggedInUserValidator from "@/app/requests/Auth/GetLoggedInUserValidator";
import loginValidator from "@/app/requests/Auth/LoginValidator";
import registerValidator from "@/app/requests/Auth/RegisterValidator";

const router = Router();

router.get('/user', authenticateJWT, getLoggedInUserValidator, validate, AuthController.getUser);

router.post('/login', loginValidator, validate, AuthController.login);

router.post('/register', registerValidator, validate, AuthController.register);

router.get('/revoke-token', authenticateJWT, AuthController.revokeToken);

router.get('/revoke-all-tokens', authenticateJWT, AuthController.revokeAllTokens);

module.exports = router;
