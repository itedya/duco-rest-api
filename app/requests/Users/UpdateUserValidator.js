const {body, param} = require('express-validator');
const {Not} = require("typeorm");

const UserRepository = require('./../../repositories/UserRepository');

module.exports = [
    param('id').isUUID(4),
    body('username').isString().isLength({min: 3, max: 64})
        .custom(async (value, {req}) => {
            const exists = await UserRepository.findOne({where: {username: value, id: Not(req.params.id)}})

            if (exists) {
                throw new Error('Username is already in use!')
            }

            return true
        }),
    body('email').isString().isLength({min: 8, max: 255})
        .custom(async (value, {req}) => {
            const exists = await UserRepository.findOne({where: {email: value, id: Not(req.params.id)}})

            if (exists) {
                throw new Error('Email is already in use!')
            }

            return true
        }),
];