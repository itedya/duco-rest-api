import {body} from 'express-validator';

export default [
    body('login').isString().isLength({min: 3, max: 255}),
    body('password').isString().isLength({min: 8, max: 255})
]