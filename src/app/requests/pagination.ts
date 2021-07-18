import { query } from 'express-validator';

export default [
    query('per_page').isInt({min: 5, max: 50}),
    query('page').isInt({min: 0, max: 999999999})
]