import {body} from 'express-validator';
import UserRepository from '@/app/repositories/UserRepository';

export default [
    body('username').isString().isLength({min: 3, max: 64})
        .custom(value => {
            return UserRepository.createQueryBuilder().where({ username: value }).getOne()
                .then((res: object | undefined) => {
                    if (res) {
                        throw new Error('Username is already in use')
                    }
                })
        }),
    body('email').isString().isEmail().isLength({min: 6, max: 320})
        .custom((value) => {
            return UserRepository.createQueryBuilder().where({ email: value }).getOne()
                .then((res: object | undefined) => {
                    if (res) {
                        throw new Error('Email is already in use')
                    }
                })
        }),
    body('password').isString().isLength({min: 8, max: 255})
];