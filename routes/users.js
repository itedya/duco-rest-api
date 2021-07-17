const express = require('express');
const router = express.Router();

const UsersContoller = require('./../app/controllers/UsersController')

const pagination = require('../app/requests/pagination')
const getUserByIdValidator = require('../app/requests/Users/GetByIdValidator')

const validate = require('./../app/middlewares/validate')

/* GET users listing. */
router.get('/', pagination, validate, UsersContoller.getUsers)

router.get('/:id', getUserByIdValidator, validate, UsersContoller.getUserById)

module.exports = router;
