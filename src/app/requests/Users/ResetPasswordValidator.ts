import { param, body } from 'express-validator';

export default [
    param('id').isUUID(),
    body('old_password').isString().isLength({min: 8, max: 255}),
    body('new_password').isString().isLength({min: 8, max: 255})
];